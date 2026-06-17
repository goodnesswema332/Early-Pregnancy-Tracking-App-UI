import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

const AnonymousChatScreen = () => {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    createChatSession,
    sendMessageToSession,
    retryMessage,
    chatSessions,
  } = useAdmin();
  const [message, setMessage] = useState("");
  const [localSessionId, setLocalSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    if (!message.trim()) return;
    const text = message.trim();
    setMessage("");

    if (!localSessionId) {
      const session = await createChatSession();
      setLocalSessionId(session.id);
      await sendMessageToSession(session.id, text, "user");
    } else {
      await sendMessageToSession(localSessionId, text, "user");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!localSessionId) return;
    const session = chatSessions.find((s) => s.id === localSessionId);
    if (session) setMessages(session.messages);
  }, [chatSessions, localSessionId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 3. Wrapped the inside with TouchableWithoutFeedback to catch taps on empty space.
        accessible={false} ensures screen readers ignore this wrapper layout step.
      */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          // 4. Reduced offset from 90 to 0 or a very minimal number depending on your navigation bar height.
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} 
        >
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>Anonymous Chat</Text>
              <Text style={styles.subtitle}>Private & confidential support</Text>
            </View>
          </View>

          <View style={styles.noticeCard}>
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={COLORS.info}
              style={styles.noticeIcon}
            />
            <Text style={styles.noticeText}>
              100% Anonymous. We don't collect personal information. Your
              conversations are private and confidential.
            </Text>
          </View>

          <ScrollView
            style={styles.messageList}
            ref={scrollViewRef}
            // 5. keyboardShouldPersistTaps="handled" ensures that tapping 
            // a retry button doesn't just close the keyboard, it actually fires the button press.
            keyboardShouldPersistTaps="handled" 
            contentContainerStyle={[
              styles.messageContent,
              { paddingBottom: 24 + insets.bottom },
            ]}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === "user"
                    ? styles.userBubble
                    : styles.supportBubble,
                ]}
              >
                {msg.sender === "support" && (
                  <Text style={styles.supportLabel}>Support Team</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === "user" ? styles.userText : styles.supportText,
                  ]}
                >
                  {msg.text}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {msg.status === "pending" && (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.info}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  {msg.status === "failed" && (
                    <TouchableOpacity
                      onPress={async () => {
                        await retryMessage(localSessionId!, msg.id);
                      }}
                      style={{ marginRight: 6 }}
                    >
                      <Ionicons name="alert-circle" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                  <Text
                    style={[
                      styles.messageTime,
                      msg.sender === "user"
                        ? styles.userTime
                        : styles.supportTime,
                    ]}
                  >
                    {formatTime(new Date(msg.timestamp))}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.inputArea, { paddingBottom: insets.bottom + 12 }]}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.info,
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
  subtitle: { fontSize: 14, color: "#D9F0F8" },
  noticeCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: -24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  noticeIcon: { marginRight: 10 },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  messageList: { flex: 1, paddingHorizontal: 20, marginTop: 12 },
  messageContent: { paddingBottom: 24 },
  messageBubble: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: COLORS.info,
    alignSelf: "flex-end",
  },
  supportBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    alignSelf: "flex-start",
  },
  supportLabel: {
    fontSize: 11,
    color: COLORS.info,
    marginBottom: 6,
    fontWeight: "700",
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: COLORS.white },
  supportText: { color: COLORS.textPrimary },
  messageTime: { marginTop: 8, fontSize: 10 },
  userTime: { color: "#E0F2F1", textAlign: "right" },
  supportTime: { color: COLORS.textSecondary, textAlign: "right" },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  sendButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: COLORS.info,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
});

export default AnonymousChatScreen;
