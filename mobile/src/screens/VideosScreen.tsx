import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

const defaultVideos = [
  {
    id: "1",
    title: "Understanding Puberty and Body Changes",
    description:
      "A guide to understanding the physical and emotional changes during puberty",
    duration: "8:45",
    views: "12.5K",
    category: "Health Education",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Making Smart Decisions About Your Future",
    description: "Learn how your choices today impact your tomorrow",
    duration: "6:30",
    views: "18.2K",
    category: "Life Skills",
    thumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
];

const VideosScreen = () => {
  const navigation = useNavigation<any>();
  const { videos: adminVideos } = useAdmin();
  const insets = useSafeAreaInsets();
  const videos =
    adminVideos && adminVideos.length ? adminVideos : defaultVideos;

  const openVideo = (video: any) => {
    if (video.url) navigation.navigate("VideoPlayer", { videoId: video.id });
    else Alert.alert("No video", "This video does not have a playable URL.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 32 + insets.bottom },
        ]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Educational Videos</Text>
            <Text style={styles.subtitle}>
              Watch and learn at your own pace
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Learn Through Video</Text>
          <Text style={styles.infoText}>
            Our educational videos cover important topics about health,
            decision-making, and planning for your future.
          </Text>
        </View>

        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => openVideo(video)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.thumbnail}
              />
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={42} color={COLORS.white} />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {(video as any).duration}
                </Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
              <View style={styles.videoMetaRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {(video as any).category}
                  </Text>
                </View>
                <View style={styles.viewsRow}>
                  <Ionicons name="eye" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.viewsText}>
                    {(video as any).views} views
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            More educational videos are being added regularly. Check back soon
            for new content!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: 32 },
  header: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: { paddingRight: 40 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#DDD6FE" },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 18,
    marginTop: -24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  infoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  videoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: COLORS.gray[200],
  },
  thumbnail: { width: "100%", height: "100%" },
  playOverlay: { position: "absolute", left: 16, top: 16 },
  durationBadge: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: { color: COLORS.white, fontSize: 12 },
  videoInfo: { padding: 16 },
  videoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryBadgeText: { fontSize: 11, color: "#7C3AED", fontWeight: "700" },
  viewsRow: { flexDirection: "row", alignItems: "center" },
  viewsText: { marginLeft: 6, fontSize: 12, color: COLORS.textSecondary },
  noteCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 18,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default VideosScreen;
