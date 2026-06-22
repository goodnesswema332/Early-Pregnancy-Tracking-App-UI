import React, { useMemo, useEffect, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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

const MiniGamesHubScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { games, updateGameResult } = useAdmin();
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

  return (
    <SafeAreaView style={styles.flexible}>
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

        {games.map((game) => (
          <View
            key={game.id}
            style={[styles.gameCard, { borderColor: game.color }]}
          >
            <View style={styles.gameHeader}>
              <View style={[styles.gameBadge, { backgroundColor: game.color }]}>
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
            Choose any activity to learn at your own pace. Discover more
            resources as you progress!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexible: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 18,
    marginTop: -20, // Overlap the header slightly for a modern look
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
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
