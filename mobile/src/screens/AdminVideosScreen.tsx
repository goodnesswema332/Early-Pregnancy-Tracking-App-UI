// AdminVideosScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

const AdminVideosScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { videos, addVideo, removeVideo, hasPrivilege } = useAdmin();

  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [videoThumbUri, setVideoThumbUri] = useState<string | null>(null);

  const handleAddVideo = async () => {
    if (!videoTitle.trim() || !videoUrl.trim()) {
      return Alert.alert(
        "Missing Details",
        "Please provide a title and video URL.",
      );
    }
    if (!hasPrivilege("canCreateContent")) {
      return Alert.alert(
        "Unauthorized",
        "You do not have permission to add videos.",
      );
    }
    try {
      await addVideo({
        title: videoTitle.trim(),
        description: videoDesc.trim(),
        url: videoUrl.trim(),
        thumbnail: videoThumbUri
          ? videoThumbUri
          : videoThumb.trim() || undefined,
      });
      setVideoTitle("");
      setVideoUrl("");
      setVideoDesc("");
      setVideoThumb("");
      setVideoThumbUri(null);
      Alert.alert("Success", "Video added to the library.");
    } catch (err) {
      Alert.alert("Error", "Failed to add video.");
    }
  };

  const handleRemoveVideo = async (id: string) => {
    Alert.alert("Delete Video", "Are you sure you want to remove this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const ok = await removeVideo(id);
          if (!ok) Alert.alert("Unable to remove", "Check permissions.");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Manage Videos</Text>
            <Text style={styles.subtitle}>
              Add or remove educational videos
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Add New Video</Text>
          <TextInput
            value={videoTitle}
            onChangeText={setVideoTitle}
            placeholder="Video Title"
            style={styles.input}
          />
          <TextInput
            value={videoDesc}
            onChangeText={setVideoDesc}
            placeholder="Short Description"
            style={styles.input}
          />
          <TextInput
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholder="Video URL (mp4, YouTube)"
            style={styles.input}
          />

          <View style={styles.thumbRow}>
            <TouchableOpacity
              style={styles.pickBtn}
              onPress={async () => {
                const { status } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") return;
                const res = await ImagePicker.launchImageLibraryAsync({
                  quality: 0.7,
                  allowsEditing: true,
                });
                if (!res.canceled) setVideoThumbUri(res.assets[0].uri);
              }}
            >
              <Ionicons name="image" size={18} color="#9333EA" />
              <Text style={styles.pickBtnText}>Upload Thumbnail</Text>
            </TouchableOpacity>
            {videoThumbUri && (
              <Image
                source={{ uri: videoThumbUri }}
                style={styles.thumbPreview}
              />
            )}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddVideo}>
            <Text style={styles.submitBtnText}>Publish Video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Library</Text>
          {videos.length === 0 && (
            <Text style={styles.note}>No videos in the library.</Text>
          )}
          {videos.map((v) => (
            <View key={v.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{v.title}</Text>
                <Text style={styles.rowSub}>{v.url}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveVideo(v.id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: "#9333EA",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.white },
  subtitle: { color: "#E9D5FF", fontSize: 13 },
  panel: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  thumbRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  pickBtnText: { color: "#9333EA", fontWeight: "600", marginLeft: 8 },
  thumbPreview: { width: 40, height: 40, borderRadius: 8 },
  submitBtn: {
    backgroundColor: "#9333EA",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: COLORS.white, fontWeight: "700" },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowTitle: { fontWeight: "600", color: COLORS.textPrimary },
  rowSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  deleteBtn: { padding: 8, backgroundColor: "#FEE2E2", borderRadius: 8 },
  note: { color: COLORS.textSecondary, fontStyle: "italic" },
});

export default AdminVideosScreen;
