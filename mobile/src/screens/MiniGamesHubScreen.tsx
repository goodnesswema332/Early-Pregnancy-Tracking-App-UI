import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

// Games are now managed centrally via AdminContext (useAdmin)

const categoryIcons: Record<string, string> = {
  Wellness: "leaf",
  Education: "book",
  Support: "help-circle",
  Resources: "navigate",
  Quiz: "help-circle",
};

const MiniGamesHubScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    games,
    addGame,
    removeGame: _removeGame,
    updateGameResult,
    admins,
    currentAdmin,
    signOutAdmin,
    chatSessions,
    assignSessionToAdmin,
    sendMessageToSession,
  } = useAdmin();
  const [pin, setPin] = useState("");
  const isAdmin = !!currentAdmin;
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Wellness");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Easy");
  const [newPoints, setNewPoints] = useState("50");
  const [newContentType, setNewContentType] = useState<"game" | "activity">(
    "game",
  );
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const insets = useSafeAreaInsets();

  const totalPoints = useMemo(
    () => games.reduce((sum, item) => sum + (item.score || 0), 0),
    [games],
  );

  const processedResultRef = useRef<number | null>(null);

  useEffect(() => {
    const result = route.params?.gameResult;
    if (
      result &&
      result.timestamp &&
      processedResultRef.current !== result.timestamp
    ) {
      processedResultRef.current = result.timestamp;
      try {
        updateGameResult(result.gameId, result.score ?? 0);
      } catch (_err) {
        // ignore if game id not found
      }
      Alert.alert(
        "Result recorded",
        `${result.gameId} — ${result.score}/${result.total}`,
      );
    }
  }, [route.params?.gameResult]);

  const completedCount = useMemo(
    () => games.filter((item) => item.completed).length,
    [games],
  );

  const handleAddContent = () => {
    if (!newTitle.trim() || !newDescription.trim() || !newCategory.trim()) {
      Alert.alert(
        "Incomplete details",
        "Please provide a title, category, and description.",
      );
      return;
    }

    const newContent = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      difficulty: newDifficulty,
      points: Number(newPoints) || 50,
      completed: false,
      color: COLORS.teal[600],
      category: newCategory,
      icon: categoryIcons[newCategory] ?? "flame",
    };

    try {
      addGame(newContent);
    } catch (_err) {
      Alert.alert(
        "Not authorized",
        "You must be signed in as an admin to add content.",
      );
      return;
    }
    setNewTitle("");
    setNewDescription("");
    setNewPoints("50");
    setNewCategory("Wellness");
    setNewDifficulty("Easy");
    setNewContentType("game");

    Alert.alert(
      "Content added",
      `The ${newContentType} "${newContent.title}" is now visible in the hub.`,
    );
  };

  const handleAdminSignIn = () => {
    Alert.alert(
      "Admin Login",
      "Please use the Profile screen to sign in as an administrator.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Profile",
          onPress: () => navigation.navigate("Main", { screen: "Profile" }),
        },
      ],
    );
  };

  const handleAdminSignOut = () => {
    signOutAdmin();
    Alert.alert("Signed out");
  };

  return (
    <SafeAreaView style={styles.flexible}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
              <Text style={styles.title}>Mini-Games Hub</Text>
              <Text style={styles.subtitle}>
                Interactive learning activities for every stage.
              </Text>
            </View>

            <View style={styles.adminToggle}>
              {isAdmin ? (
                <>
                  <Ionicons
                    name="shield-checkmark"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.adminToggleText}>
                    Admin: {currentAdmin?.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.adminActionButton}
                    onPress={handleAdminSignOut}
                  >
                    <Text style={styles.adminActionText}>Sign Out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    value={pin}
                    onChangeText={setPin}
                    placeholder="Admin PIN"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    style={styles.adminPinInput}
                  />
                  <TouchableOpacity
                    style={styles.adminSignInButton}
                    onPress={handleAdminSignIn}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color={COLORS.white}
                    />
                    <Text style={styles.adminActionText}>Sign In</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.white }]}>
              <Ionicons
                name="trophy"
                size={22}
                color={COLORS.coral[600]}
                style={styles.statIcon}
              />
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.white }]}>
              <Ionicons
                name="star"
                size={22}
                color={COLORS.coral[600]}
                style={styles.statIcon}
              />
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed Activities</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.white }]}>
              <Ionicons
                name="ribbon"
                size={22}
                color={COLORS.coral[600]}
                style={styles.statIcon}
              />
              <Text style={styles.statValue}>Bronze</Text>
              <Text style={styles.statLabel}>Current Rank</Text>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.adminPanel}>
              <View style={styles.adminHeader}>
                <Text style={styles.adminTitle}>Admin Content Portal</Text>
                <Text style={styles.adminSubtitle}>
                  Add new games or activities directly to the hub.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="New content title"
                  placeholderTextColor={COLORS.gray[400]}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="Wellness, Education, Support"
                  placeholderTextColor={COLORS.gray[400]}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  value={newDescription}
                  onChangeText={setNewDescription}
                  placeholder="Describe the new activity"
                  placeholderTextColor={COLORS.gray[400]}
                  style={[styles.input, styles.multiLineInput]}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inlineRow}>
                <View style={styles.smallInputGroup}>
                  <Text style={styles.inputLabel}>Difficulty</Text>
                  <TextInput
                    value={newDifficulty}
                    onChangeText={setNewDifficulty}
                    placeholder="Easy / Medium / Hard"
                    placeholderTextColor={COLORS.gray[400]}
                    style={styles.input}
                  />
                </View>

                <View style={styles.smallInputGroup}>
                  <Text style={styles.inputLabel}>Points</Text>
                  <TextInput
                    value={newPoints}
                    onChangeText={setNewPoints}
                    placeholder="50"
                    placeholderTextColor={COLORS.gray[400]}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inlineRow}>
                <TouchableOpacity
                  style={[
                    styles.contentTypeButton,
                    newContentType === "game" && styles.contentTypeButtonActive,
                  ]}
                  onPress={() => setNewContentType("game")}
                >
                  <Text
                    style={[
                      styles.contentTypeText,
                      newContentType === "game" && styles.contentTypeTextActive,
                    ]}
                  >
                    Game
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contentTypeButton,
                    newContentType === "activity" &&
                      styles.contentTypeButtonActive,
                  ]}
                  onPress={() => setNewContentType("activity")}
                >
                  <Text
                    style={[
                      styles.contentTypeText,
                      newContentType === "activity" &&
                        styles.contentTypeTextActive,
                    ]}
                  >
                    Activity
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleAddContent}
              >
                <Ionicons
                  name="cloud-upload"
                  size={18}
                  color={COLORS.white}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadButtonText}>Upload Content</Text>
              </TouchableOpacity>

              <View style={{ height: 16 }} />
              <Text style={[styles.adminSubtitle, { marginTop: 8 }]}>
                Live Chat Queue
              </Text>
              {chatSessions.length === 0 && (
                <Text style={styles.noteText}>No active sessions.</Text>
              )}
              {chatSessions.map((s) => (
                <View key={s.id} style={styles.chatSessionCard}>
                  <View style={styles.chatSessionHeader}>
                    <Text style={styles.chatSessionTitle}>
                      Session {s.id.slice(-6)}
                    </Text>
                    <Text style={styles.chatSessionStatus}>{s.status}</Text>
                  </View>
                  <Text style={styles.chatSessionMeta}>
                    Assigned:{" "}
                    {s.assignedTo
                      ? (admins.find((a) => a.id === s.assignedTo)?.name ?? "—")
                      : "Unassigned"}
                  </Text>
                  <View style={styles.chatMessagesPreview}>
                    {s.messages.slice(-3).map((m: any, idx: number) => (
                      <Text key={idx} style={styles.chatPreviewText}>
                        {m.sender}: {m.text}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.inlineRow}>
                    {isAdmin && !s.assignedTo && (
                      <TouchableOpacity
                        style={styles.assignButton}
                        onPress={async () => {
                          const ok = await assignSessionToAdmin(
                            s.id,
                            currentAdmin!.id,
                          );
                          if (!ok) Alert.alert("Unable to assign");
                        }}
                      >
                        <Text style={styles.assignButtonText}>
                          Assign to me
                        </Text>
                      </TouchableOpacity>
                    )}
                    {isAdmin && s.assignedTo === currentAdmin?.id && (
                      <>
                        <TextInput
                          value={replyTexts[s.id] || ""}
                          onChangeText={(t) =>
                            setReplyTexts((prev) => ({ ...prev, [s.id]: t }))
                          }
                          placeholder="Reply to user"
                          placeholderTextColor={COLORS.gray[400]}
                          style={[styles.input, { flex: 1 }]}
                        />
                        <TouchableOpacity
                          style={styles.uploadButton}
                          onPress={async () => {
                            const txt = replyTexts[s.id]?.trim();
                            if (!txt) return;
                            await sendMessageToSession(s.id, txt, "support");
                            setReplyTexts((prev) => ({ ...prev, [s.id]: "" }));
                          }}
                        >
                          <Text style={styles.uploadButtonText}>Send</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {games.map((game) => (
            <View
              key={game.id}
              style={[styles.gameCard, { borderColor: game.color }]}
            >
              <View style={styles.gameHeader}>
                <View
                  style={[styles.gameBadge, { backgroundColor: game.color }]}
                >
                  <Ionicons name={game.icon} size={20} color={COLORS.white} />
                </View>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameDescription}>{game.description}</Text>
                </View>
              </View>
              <View style={styles.gameDetailRow}>
                <Text style={styles.gameDetailText}>
                  Category: {game.category}
                </Text>
                <Text style={styles.gameDetailText}>{game.points} pts</Text>
              </View>
              <View style={styles.gameDetailRow}>
                <Text style={styles.gameDetailText}>
                  Difficulty: {game.difficulty}
                </Text>
                <Text style={styles.gameDetailText}>
                  {game.completed ? "Completed" : "Ready"}
                </Text>
              </View>
              {game.completed && (
                <Text style={styles.completedText}>
                  Last score: {game.score}/{game.points}
                </Text>
              )}
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: game.color }]}
                onPress={() =>
                  navigation.navigate("QuizGame", { gameId: game.id })
                }
              >
                <Text style={styles.startButtonText}>
                  {game.completed ? "Replay" : "Begin"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Hub Guidelines</Text>
            <Text style={styles.noteText}>
              Choose any activity to learn at your own pace. Admin mode allows
              safe content management and rapid updates for new modules.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexible: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.coral[50] },
  contentContainer: { paddingBottom: 32 },
  header: {
    backgroundColor: COLORS.coral[600],
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
  headerText: { paddingRight: 40, marginBottom: 14 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#FECACA" },
  adminToggle: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
  },
  adminToggleText: { color: COLORS.white, marginLeft: 8, fontWeight: "600" },
  adminPinInput: {
    minWidth: 120,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    color: COLORS.white,
    marginRight: 8,
  },
  adminSignInButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
  },
  adminActionButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
  },
  adminActionText: { color: COLORS.white, marginLeft: 8, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  adminPanel: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  adminHeader: { marginBottom: 16 },
  adminTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  adminSubtitle: { fontSize: 13, color: COLORS.textSecondary },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.coral[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
  },
  multiLineInput: { minHeight: 80, textAlignVertical: "top" },
  inlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  smallInputGroup: { flex: 1 },
  contentTypeButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  contentTypeButtonActive: {
    backgroundColor: COLORS.coral[600],
    borderColor: COLORS.coral[600],
  },
  contentTypeText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  contentTypeTextActive: { color: COLORS.white },
  uploadButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.teal[600],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIcon: { marginRight: 8 },
  uploadButtonText: { color: COLORS.white, fontWeight: "700" },
  gameCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  gameHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  gameBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  gameMeta: { flex: 1 },
  gameTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  gameDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  gameDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gameDetailText: { fontSize: 12, color: COLORS.textSecondary },
  completedText: { fontSize: 13, color: COLORS.teal[700], marginBottom: 12 },
  startButton: {
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: { color: COLORS.white, fontWeight: "700" },
  chatSessionCard: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  chatSessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatSessionTitle: { fontWeight: "700" },
  chatSessionStatus: { fontSize: 12, color: COLORS.gray[500] },
  chatSessionMeta: { fontSize: 12, color: COLORS.gray[600], marginTop: 6 },
  chatMessagesPreview: { marginTop: 8 },
  chatPreviewText: { fontSize: 12, color: COLORS.gray[700] },
  assignButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.coral[600],
    borderRadius: 8,
  },
  assignButtonText: { color: COLORS.white, fontWeight: "700" },
  noteCard: {
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.teal[800],
    marginBottom: 10,
  },
  noteText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
});

export default MiniGamesHubScreen;
