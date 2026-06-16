import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

const AdminManagementScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    admins,
    currentAdmin,
    signOutAdmin,
    setAdminAvailability,
    chatSessions,
    assignSessionToAdmin,
    sendMessageToSession,
    closeSession,
    videos,
    addVideo,
    removeVideo,
    hasPrivilege,
  } = useAdmin();

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [videoThumbUri, setVideoThumbUri] = useState<string | null>(null);
  const [videoThumbBase64, setVideoThumbBase64] = useState<string | null>(null);

  // Check if user can access this screen
  if (!currentAdmin) {
    return (
      <SafeAreaView
        style={[
          styles.unauthorizedContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Ionicons name="lock-closed" size={64} color={COLORS.coral[600]} />
        <Text style={styles.unauthorizedTitle}>Access Denied</Text>
        <Text style={styles.unauthorizedText}>
          Please sign in as an administrator to access this area.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAddVideo = () => {
    (async () => {
      if (!videoTitle.trim() || !videoUrl.trim()) {
        return Alert.alert("Missing", "Provide a title and video URL");
      }
      if (!hasPrivilege("canCreateContent")) {
        return Alert.alert(
          "Unauthorized",
          "You do not have permission to add videos",
        );
      }
      try {
        const thumb = videoThumbBase64
          ? videoThumbBase64
          : videoThumb.trim() || undefined;
        await addVideo({
          title: videoTitle.trim(),
          url: videoUrl.trim(),
          thumbnail: thumb as any,
        });
        setVideoTitle("");
        setVideoUrl("");
        setVideoThumb("");
        setVideoThumbUri(null);
        setVideoThumbBase64(null);
        Alert.alert("Video added");
      } catch (_err) {
        Alert.alert("Error", "Failed to add video. Please try again.");
      }
    })();
  };

  const handleRemoveVideo = async (id: string) => {
    const ok = await removeVideo(id);
    if (!ok)
      Alert.alert("Unable to remove", "Check permissions or protection flag");
  };

  const handleSendReply = async (sessionId: string) => {
    const txt = (replyTexts[sessionId] || "").trim();
    if (!txt) return;
    if (!hasPrivilege("canChat")) {
      Alert.alert("Unauthorized", "You do not have chat privileges");
      return;
    }
    // Bug Fix: Use 'support' instead of 'admin' for sender alignment
    await sendMessageToSession(sessionId, txt, "support");
    setReplyTexts((prev) => ({ ...prev, [sessionId]: "" }));
  };

  const handleAssignToMe = async (sessionId: string) => {
    if (!currentAdmin) return;
    if (!hasPrivilege("canChat")) {
      Alert.alert("Unauthorized", "You do not have chat privileges");
      return;
    }
    const ok = await assignSessionToAdmin(sessionId, currentAdmin.id);
    if (!ok)
      Alert.alert(
        "Unable to assign",
        "No available admins or permission denied",
      );
  };

  const isSuperAdmin = currentAdmin.role === "super";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 40 + insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Admin Console</Text>
          <Text style={styles.subtitle}>Manage administrative functions</Text>
        </View>
        {isSuperAdmin && (
          <TouchableOpacity
            style={styles.superAdminBtn}
            onPress={() => navigation.navigate("SuperAdminManagement")}
          >
            <Ionicons name="shield-checkmark" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.panel}>
        {/* Current Admin Section */}
        <Text style={styles.sectionTitle}>Current Admin</Text>
        <View style={styles.currentAdminCard}>
          <View style={styles.currentAdminInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentAdmin.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.currentAdminDetails}>
              <Text style={styles.currentAdminName}>{currentAdmin.name}</Text>
              <Text style={styles.currentAdminEmail}>{currentAdmin.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {currentAdmin.role === "super"
                    ? "Super Admin"
                    : currentAdmin.role === "admin"
                      ? "Admin"
                      : "Agent"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.signOutBtn} onPress={signOutAdmin}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Privileges Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Your Privileges
        </Text>
        <View style={styles.privilegesContainer}>
          <View
            style={[
              styles.privilegeItem,
              !hasPrivilege("canChat") && styles.privilegeDisabled,
            ]}
          >
            <Ionicons
              name={
                hasPrivilege("canChat") ? "chatbubbles" : "chatbubbles-outline"
              }
              size={20}
              color={
                hasPrivilege("canChat") ? COLORS.teal[600] : COLORS.gray[400]
              }
            />
            <Text
              style={[
                styles.privilegeText,
                !hasPrivilege("canChat") && styles.privilegeTextDisabled,
              ]}
            >
              Chat Access
            </Text>
            {hasPrivilege("canChat") && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
          <View
            style={[
              styles.privilegeItem,
              !hasPrivilege("canCreateContent") && styles.privilegeDisabled,
            ]}
          >
            <Ionicons
              name={
                hasPrivilege("canCreateContent") ? "create" : "create-outline"
              }
              size={20}
              color={
                hasPrivilege("canCreateContent")
                  ? COLORS.coral[600]
                  : COLORS.gray[400]
              }
            />
            <Text
              style={[
                styles.privilegeText,
                !hasPrivilege("canCreateContent") &&
                  styles.privilegeTextDisabled,
              ]}
            >
              Content Creation
            </Text>
            {hasPrivilege("canCreateContent") && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
          <View
            style={[
              styles.privilegeItem,
              !hasPrivilege("canManageUsers") && styles.privilegeDisabled,
            ]}
          >
            <Ionicons
              name={
                hasPrivilege("canManageUsers") ? "people" : "people-outline"
              }
              size={20}
              color={
                hasPrivilege("canManageUsers") ? COLORS.info : COLORS.gray[400]
              }
            />
            <Text
              style={[
                styles.privilegeText,
                !hasPrivilege("canManageUsers") && styles.privilegeTextDisabled,
              ]}
            >
              User Management
            </Text>
            {hasPrivilege("canManageUsers") && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            )}
          </View>
        </View>

        {/* All Admins Section - Only for Super Admin */}
        {isSuperAdmin && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              All Admins
            </Text>
            {admins.map((a) => (
              <View key={a.id} style={styles.adminRow}>
                <View style={styles.adminRowInfo}>
                  <Text style={styles.adminRowName}>{a.name}</Text>
                  <Text style={styles.adminRowEmail}>{a.email}</Text>
                  <View style={styles.adminRowMeta}>
                    <Text
                      style={[
                        styles.adminRowRole,
                        {
                          color:
                            a.role === "super"
                              ? COLORS.coral[600]
                              : a.role === "admin"
                                ? COLORS.teal[600]
                                : COLORS.info,
                        },
                      ]}
                    >
                      {a.role === "super"
                        ? "Super"
                        : a.role === "admin"
                          ? "Admin"
                          : "Agent"}
                    </Text>
                    <Text style={styles.dot}>•</Text>
                    <Text
                      style={[
                        styles.adminRowStatus,
                        { color: a.available ? "#10B981" : "#F59E0B" },
                      ]}
                    >
                      {a.available ? "Available" : "Busy"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setAdminAvailability(a.id, !a.available)}
                  style={[
                    styles.availabilityBtn,
                    { backgroundColor: a.available ? "#FEE2E2" : "#D1FAE5" },
                  ]}
                >
                  <Text
                    style={[
                      styles.availabilityBtnText,
                      { color: a.available ? "#DC2626" : "#059669" },
                    ]}
                  >
                    {a.available ? "Set Busy" : "Set Available"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Content Management Section */}
        {hasPrivilege("canCreateContent") && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Add Video
            </Text>
            <TextInput
              value={videoTitle}
              onChangeText={setVideoTitle}
              placeholder="Video title"
              placeholderTextColor={COLORS.gray[400]}
              style={styles.input}
            />
            <TextInput
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="Video URL (mp4 or YouTube/Vimeo)"
              placeholderTextColor={COLORS.gray[400]}
              style={styles.input}
            />
            <TextInput
              value={videoThumb}
              onChangeText={setVideoThumb}
              placeholder="Thumbnail URL (optional)"
              placeholderTextColor={COLORS.gray[400]}
              style={styles.input}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                style={styles.pickThumbBtn}
                onPress={async () => {
                  const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (status !== "granted")
                    return Alert.alert(
                      "Permission required",
                      "Allow photo access to pick a thumbnail",
                    );
                  const res = await ImagePicker.launchImageLibraryAsync({
                    base64: true,
                    quality: 0.7,
                    allowsEditing: true,
                  });
                  if (!res.canceled) {
                    setVideoThumbUri(res.assets[0].uri);
                    if (res.assets[0].base64)
                      setVideoThumbBase64(
                        `data:image/jpeg;base64,${res.assets[0].base64}`,
                      );
                  }
                }}
              >
                <Text style={styles.pickThumbText}>Pick Thumbnail</Text>
              </TouchableOpacity>
              {videoThumbUri && (
                <Image
                  source={{ uri: videoThumbUri }}
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                />
              )}
            </View>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleAddVideo}>
              <Text style={styles.uploadBtnText}>Upload Video</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Educational Content Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Educational Content
        </Text>
        <TouchableOpacity
          style={styles.contentBtn}
          onPress={() => navigation.navigate("AdminTopics")}
        >
          <Ionicons name="book" size={18} color={COLORS.white} />
          <Text style={styles.contentBtnText}>Manage Topics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.contentBtn,
            { backgroundColor: COLORS.teal[500], marginTop: 8 },
          ]}
          onPress={() => navigation.navigate("AdminFaqs")}
        >
          <Ionicons name="help-circle" size={18} color={COLORS.white} />
          <Text style={styles.contentBtnText}>Manage FAQs</Text>
        </TouchableOpacity>

        {/* Chat Sessions Section */}
        {hasPrivilege("canChat") && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Chat Sessions
            </Text>
            {chatSessions.length === 0 && (
              <Text style={styles.note}>No sessions yet.</Text>
            )}
            {chatSessions.map((s) => (
              <View key={s.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionUser}>{s.userLabel}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          s.status === "active"
                            ? "#D1FAE5"
                            : s.status === "waiting"
                              ? "#FEF3C7"
                              : s.status === "assigned"
                                ? "#EEF2FF"
                                : "#F3F4F6",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          s.status === "active"
                            ? "#059669"
                            : s.status === "waiting"
                              ? "#D97706"
                              : s.status === "assigned"
                                ? "#4F46E5"
                                : "#6B7280",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sessionDate}>
                  {new Date(s.createdAt).toLocaleString()}
                </Text>
                <Text style={styles.sessionAssigned}>
                  Assigned:{" "}
                  {s.assignedTo
                    ? (admins.find((a) => a.id === s.assignedTo)?.name ??
                      "Unknown")
                    : "Unassigned"}
                </Text>

                {/* Recent Messages Preview */}
                {s.messages.length > 0 && (
                  <View style={styles.messagesPreview}>
                    {s.messages.slice(-2).map((m) => (
                      <Text key={m.id} style={styles.messagePreview}>
                        <Text style={{ fontWeight: "600" }}>{m.sender}:</Text>{" "}
                        {m.text.slice(0, 50)}
                        {m.text.length > 50 ? "..." : ""}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.sessionActions}>
                  {!s.assignedTo && (
                    <TouchableOpacity
                      style={styles.sessionBtn}
                      onPress={() => handleAssignToMe(s.id)}
                    >
                      <Text style={styles.sessionBtnText}>Assign to me</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.sessionBtn,
                      { backgroundColor: COLORS.coral[600] },
                    ]}
                    onPress={() =>
                      navigation.navigate("AdminChatDetail", {
                        sessionId: s.id,
                      })
                    }
                  >
                    <Text
                      style={[styles.sessionBtnText, { color: COLORS.white }]}
                    >
                      Open Chat
                    </Text>
                  </TouchableOpacity>
                  {s.assignedTo === currentAdmin?.id && (
                    <>
                      <TextInput
                        value={replyTexts[s.id] || ""}
                        onChangeText={(t) =>
                          setReplyTexts((prev) => ({ ...prev, [s.id]: t }))
                        }
                        placeholder="Quick reply..."
                        placeholderTextColor={COLORS.gray[400]}
                        style={styles.replyInput}
                      />
                      <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={() => handleSendReply(s.id)}
                      >
                        <Ionicons name="send" size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    style={[styles.sessionBtn, { backgroundColor: "#FEE2E2" }]}
                    onPress={async () => {
                      const ok = await closeSession(s.id);
                      if (!ok)
                        Alert.alert("Unable to close", "Check permissions");
                    }}
                  >
                    <Text style={[styles.sessionBtnText, { color: "#DC2626" }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Existing Videos Section */}
        {hasPrivilege("canCreateContent") && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Existing Videos
            </Text>
            {videos.length === 0 && (
              <Text style={styles.note}>No videos yet.</Text>
            )}
            {videos.map((v) => (
              <View key={v.id} style={styles.videoRow}>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{v.title}</Text>
                  <Text style={styles.videoUrl}>{v.url ?? v.thumbnail}</Text>
                </View>
                <View style={styles.videoActions}>
                  <TouchableOpacity
                    style={styles.videoBtn}
                    onPress={() =>
                      navigation.navigate("VideoPlayer", { videoId: v.id })
                    }
                  >
                    <Text style={styles.videoBtnText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.videoBtn,
                      { backgroundColor: "#FEE2E2", marginLeft: 8 },
                    ]}
                    onPress={() => handleRemoveVideo(v.id)}
                  >
                    <Text style={[styles.videoBtnText, { color: "#DC2626" }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.coral[600],
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerText: { flex: 1 },
  title: { fontSize: 26, fontWeight: "700", color: COLORS.white },
  subtitle: { color: "#FECACA", marginTop: 4 },
  superAdminBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  panel: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  currentAdminCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  currentAdminInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.coral[600],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  currentAdminDetails: {
    marginLeft: 14,
    flex: 1,
  },
  currentAdminName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  currentAdminEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.coral[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.coral[700],
  },
  signOutBtn: {
    marginTop: 12,
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  privilegesContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },
  privilegeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  privilegeDisabled: {
    opacity: 0.6,
  },
  privilegeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  privilegeTextDisabled: {
    color: COLORS.gray[400],
  },
  adminRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  adminRowInfo: {
    flex: 1,
  },
  adminRowName: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  adminRowEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  adminRowMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  adminRowRole: {
    fontSize: 12,
    fontWeight: "600",
  },
  dot: {
    marginHorizontal: 6,
    color: COLORS.gray[400],
  },
  adminRowStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  availabilityBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  availabilityBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pickThumbBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  pickThumbText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 13,
  },
  uploadBtn: {
    marginTop: 12,
    backgroundColor: COLORS.coral[600],
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  uploadBtnText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  contentBtn: {
    backgroundColor: COLORS.teal[600],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contentBtnText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  note: { color: COLORS.textSecondary, marginTop: 6, fontStyle: "italic" },
  sessionCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionUser: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionDate: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  sessionAssigned: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },
  messagesPreview: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  messagePreview: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },
  sessionActions: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    gap: 8,
  },
  sessionBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sessionBtnText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 13,
  },
  replyInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: COLORS.coral[600],
    padding: 10,
    borderRadius: 8,
  },
  videoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  videoInfo: {
    flex: 1,
    marginRight: 12,
  },
  videoTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  videoUrl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  videoActions: {
    flexDirection: "row",
  },
  videoBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  videoBtnText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 13,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: COLORS.background,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 24,
  },
  unauthorizedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});

export default AdminManagementScreen;
