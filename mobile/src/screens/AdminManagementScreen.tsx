// AdminManagementScreen.tsx
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
    hasPrivilege,
  } = useAdmin();

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

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

  const handleSendReply = async (sessionId: string) => {
    const txt = (replyTexts[sessionId] || "").trim();
    if (!txt) return;
    if (!hasPrivilege("canChat")) {
      Alert.alert("Unauthorized", "You do not have chat privileges");
      return;
    }
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

  const contentModules = [
    {
      title: "Videos",
      icon: "play-circle",
      route: "AdminVideos",
      color: "#9333EA",
    },
    {
      title: "Topics",
      icon: "book",
      route: "AdminTopics",
      color: COLORS.teal[600],
    },
    {
      title: "FAQs",
      icon: "help-circle",
      route: "AdminFaqs",
      color: COLORS.info,
    },
    {
      title: "Mini-Games",
      icon: "game-controller",
      route: "AdminGames",
      color: COLORS.coral[600],
    },
    {
      title: "Services",
      icon: "medkit",
      route: "AdminServices",
      color: "#10B981",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 40 + insets.bottom },
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

        {/* Content Management Grid */}
        {hasPrivilege("canCreateContent") && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Content Management
            </Text>
            <View style={styles.gridContainer}>
              {contentModules.map((mod, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.gridItem, { backgroundColor: mod.color }]}
                  onPress={() => navigation.navigate(mod.route)}
                >
                  <Ionicons
                    name={mod.icon as any}
                    size={28}
                    color={COLORS.white}
                  />
                  <Text style={styles.gridItemText}>{mod.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Chat Sessions Section */}
        {hasPrivilege("canChat") && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Active Chat Sessions
            </Text>
            {chatSessions.length === 0 && (
              <Text style={styles.note}>No active sessions at the moment.</Text>
            )}
            {chatSessions.map((s) => (
              <View key={s.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionUser}>{s.userLabel}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sessionAssigned}>
                  Assigned:{" "}
                  {s.assignedTo
                    ? (admins.find((a) => a.id === s.assignedTo)?.name ??
                      "Unknown")
                    : "Unassigned"}
                </Text>

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
  // ... Keep all existing styles from your original AdminManagementScreen ...
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
  currentAdminInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.coral[600],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: COLORS.white },
  currentAdminDetails: { marginLeft: 14, flex: 1 },
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
  roleBadgeText: { fontSize: 11, fontWeight: "600", color: COLORS.coral[700] },
  signOutBtn: {
    marginTop: 12,
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: { color: "#DC2626", fontWeight: "600" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  gridItemText: {
    color: COLORS.white,
    fontWeight: "700",
    marginTop: 8,
    fontSize: 13,
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
  sessionUser: { fontWeight: "700", fontSize: 14, color: COLORS.textPrimary },
  statusBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: { color: "#4F46E5", fontSize: 12, fontWeight: "600" },
  sessionAssigned: { color: "#6B7280", fontSize: 12, marginTop: 4 },
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
  sessionBtnText: { color: "#4F46E5", fontWeight: "600", fontSize: 13 },
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
  backButtonText: { color: COLORS.white, fontWeight: "700" },
});

export default AdminManagementScreen;
