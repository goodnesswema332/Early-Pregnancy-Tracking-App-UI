import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Video } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";
import { Linking } from "react-native";

const VideoPlayerScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { videoId } = route.params || {};
  const { videos } = useAdmin();
  const found = videos.find((v) => v.id === videoId) || route.params?.video;
  const videoRef = useRef<any | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [WebViewComp, setWebViewComp] = useState<any | null>(null);

  const toYouTubeEmbed = (url: string) => {
    try {
      const idMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{6,11})/);
      const id = idMatch ? idMatch[1] : null;
      if (id) return `https://www.youtube.com/embed/${id}?controls=1`;
    } catch (_e) {}
    return url;
  };

  const isYouTube = (u: string) => /youtube\.com|youtu\.be/.test(u);
  const isVimeo = (u: string) => /vimeo\.com/.test(u);

  useEffect(() => {
    // try to lazy-require react-native-webview; if not installed, keep it null and show fallback
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const mod = require("react-native-webview");
      const Comp = mod?.WebView || mod?.default || mod;
      if (Comp) setWebViewComp(() => Comp);
    } catch (_e) {
      setWebViewComp(null);
    }
  }, []);

  if (!found || !found.url) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={{ color: COLORS.textSecondary }}>
          No video URL available.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{found.title}</Text>
        </View>
      </View>
      {isYouTube(found.url) || isVimeo(found.url) ? (
        WebViewComp ? (
          <WebViewComp
            source={{
              uri: isYouTube(found.url) ? toYouTubeEmbed(found.url) : found.url,
            }}
            style={{ height: 260 }}
          />
        ) : (
          <View
            style={{
              height: 260,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: COLORS.textSecondary, marginBottom: 8 }}>
              WebView not available. Install react-native-webview.
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  isYouTube(found.url) ? toYouTubeEmbed(found.url) : found.url,
                )
              }
              style={{
                padding: 8,
                backgroundColor: COLORS.coral[600],
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff" }}>Open in browser</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <>
          <Video
            ref={(r: any) => (videoRef.current = r)}
            source={{ uri: found.url }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            onPlaybackStatusUpdate={(s: any) => setStatus(s)}
          />

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (status?.isPlaying) await videoRef.current?.pauseAsync();
                  else await videoRef.current?.playAsync();
                } catch (_err) {
                  Alert.alert("Playback error");
                }
              }}
              style={styles.playPause}
            >
              <Ionicons
                name={status?.isPlaying ? "pause" : "play"}
                size={20}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <Text style={styles.timeText}>
              {status?.positionMillis
                ? `${Math.floor(status.positionMillis / 1000)}s`
                : ""}
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.coral[600],
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { paddingLeft: 12, flex: 1 },
  title: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
  video: { width: "100%", height: 260, backgroundColor: "#000" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "center",
  },
  playPause: {
    backgroundColor: COLORS.coral[600],
    padding: 12,
    borderRadius: 999,
    marginRight: 12,
  },
  timeText: { color: COLORS.textSecondary },
});

export default VideoPlayerScreen;
