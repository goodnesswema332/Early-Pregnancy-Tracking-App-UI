import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAdmin } from "../context/AdminContext";
import { COLORS } from "../constants/colors";

const AdminChatDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { sessionId } = route.params || {};
  const {
    chatSessions,
    sendMessageToSession,
    retryMessage,
    assignSessionToAdmin,
    closeSession,
    admins,
    currentAdmin,
    hasPrivilege,
  } = useAdmin();
  const [text, setText] = useState("");
  const [session, setSession] = useState<any>(null);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const s = chatSessions.find((x) => x.id === sessionId);
    setSession(s || null);
  }, [chatSessions, sessionId]);

  const handleSend = async () => {
    if (!text.trim() || !session) return;
    if (!hasPrivilege("canChat")) {
      return;
    }
    // Bug Fix: Use 'support' instead of 'admin' to ensure proper alignment
    // This allows AnonymousChatScreen to correctly identify support messages
    await sendMessageToSession(session.id, text.trim(), "support");
    setText("");
    setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 100);
  };

  const handleAssign = async () => {
    if (!currentAdmin || !session) return;
    if (!hasPrivilege("canChat")) {
      return;
    }
    const ok = await assignSessionToAdmin(session.id, currentAdmin.id);
    if (!ok) {
      // Silently handle error - UI will update from context
    }
  };

  const handleClose = async () => {
    if (!session) return;
    const ok = await closeSession(session.id);
    if (!ok) {
      // Silently handle error - UI will update from context
    }
  };

  // Check if current user is assigned to this session
  const isAssigned = session?.assignedTo === currentAdmin?.id;

  // Get assigned admin name
  const assignedAdminName = session?.assignedTo
    ? admins.find((a) => a.id === session.assignedTo)?.name || "Unknown"
    : "Unassigned";

  if (!session) {
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
        <Text style={{ color: COLORS.textSecondary }}>Session not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{session.userLabel}</Text>
            <Text style={styles.subtitle}>
              {session.status} • {assignedAdminName}
            </Text>
          </View>
          {!session.assignedTo && currentAdmin && (
            <TouchableOpacity style={styles.assignBtn} onPress={handleAssign}>
              <Text style={styles.assignText}>Assign to me</Text>
            </TouchableOpacity>
          )}
          {isAssigned && (
            <TouchableOpacity
              style={[styles.assignBtn, { backgroundColor: "#FECACA" }]}
              onPress={handleClose}
            >
              <Text style={[styles.assignText, { color: "#DC2626" }]}>
                Close
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatRef}
          data={session.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msgRow,
                // Bug Fix: Check for 'support' sender to align support messages correctly
                item.sender === "support" ? styles.msgSupport : styles.msgUser,
              ]}
            >
              {item.sender === "support" && (
                <Text style={styles.supportLabel}>Support Team</Text>
              )}
              <Text style={styles.msgText}>{item.text}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                {item.status === "pending" && (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.coral[600]}
                    style={{ marginRight: 6 }}
                  />
                )}
                {item.status === "failed" && (
                  <TouchableOpacity
                    onPress={async () => {
                      await retryMessage(session.id, item.id);
                    }}
                    style={{ marginRight: 6 }}
                  >
                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
                <Text style={styles.msgTime}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 12 + insets.bottom,
          }}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd?.({ animated: false })
          }
        />

        {/* Input Area - Only show if assigned to this session */}
        {isAssigned && (
          <View
            style={[styles.inputRow, { paddingBottom: 12 + insets.bottom }]}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a reply..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Ionicons name="send" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Not assigned banner */}
        {!isAssigned && session.status !== "closed" && (
          <View style={styles.notAssignedBanner}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.notAssignedText}>
              {session.assignedTo
                ? "This session is assigned to another admin"
                : "Assign this session to reply"}
            </Text>
          </View>
        )}

        {/* Closed session banner */}
        {session.status === "closed" && (
          <View
            style={[styles.notAssignedBanner, { backgroundColor: "#F3F4F6" }]}
          >
            <Ionicons name="lock-closed" size={20} color={COLORS.gray[500]} />
            <Text style={[styles.notAssignedText, { color: COLORS.gray[600] }]}>
              This session has been closed
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.coral[600],
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  title: { color: COLORS.white, fontWeight: "700", fontSize: 16 },
  subtitle: { color: "#FECACA", fontSize: 12 },
  assignBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  assignText: { color: "#4F46E5", fontWeight: "700", fontSize: 12 },
  msgRow: { marginVertical: 6, padding: 12, borderRadius: 16, maxWidth: "80%" },
  msgUser: { alignSelf: "flex-start", backgroundColor: "#F3F4F6" },
  msgSupport: {
    alignSelf: "flex-end",
    backgroundColor: "#D1FAE5",
  },
  supportLabel: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 4,
  },
  msgText: { color: "#111827", fontSize: 14, lineHeight: 20 },
  msgTime: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: COLORS.white,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sendBtn: {
    backgroundColor: COLORS.coral[600],
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
  },
  notAssignedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    backgroundColor: "#E0F2FE",
    gap: 8,
  },
  notAssignedText: {
    fontSize: 14,
    color: COLORS.info,
    fontWeight: "500",
  },
});

export default AdminChatDetailScreen;
