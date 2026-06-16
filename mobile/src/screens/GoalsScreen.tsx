import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

const GoalsScreen = () => {
  const navigation = useNavigation<any>();
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Complete high school with good grades",
      category: "Education",
      deadline: "2028",
      progress: 60,
      completed: false,
    },
    {
      id: "2",
      title: "Join university to study medicine",
      category: "Career",
      deadline: "2029",
      progress: 20,
      completed: false,
    },
    {
      id: "3",
      title: "Complete all educational modules in the app",
      category: "Learning",
      deadline: "Jun 2026",
      progress: 42,
      completed: false,
    },
    {
      id: "4",
      title: "Talk to my parents about my future plans",
      category: "Personal",
      deadline: "May 2026",
      progress: 100,
      completed: true,
    },
  ]);

  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // try load persisted goals per user
    const load = async () => {
      try {
        const AsyncStorage =
          require("@react-native-async-storage/async-storage").default;
        const uid = user?._id || "anon";
        const raw = await AsyncStorage.getItem(`goals:${uid}`);
        if (raw) setGoals(JSON.parse(raw));
      } catch (_e) {
        // ignore
      }
    };
    load();
    const unsub = navigation.addListener("focus", load);
    return () => unsub();
  }, []);

  const categoryColors: Record<string, { background: string; text: string }> = {
    Education: { background: COLORS.teal[100], text: COLORS.teal[700] },
    Career: { background: "#E9D5FF", text: "#6D28D9" },
    Learning: { background: "#DBEAFE", text: "#1D4ED8" },
    Personal: { background: COLORS.coral[100], text: COLORS.coral[700] },
  };

  const completedGoals = goals.filter((goal) => goal.completed);
  const activeGoals = goals.filter((goal) => !goal.completed);

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
            <Text style={styles.title}>My Future Goals</Text>
            <Text style={styles.subtitle}>
              Plan and track your journey to success
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="trophy"
            size={22}
            color={COLORS.teal[600]}
            style={styles.infoIcon}
          />
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Why Goal Setting Matters</Text>
            <Text style={styles.infoText}>
              Having clear goals helps you make better decisions today for a
              brighter tomorrow. Each goal you achieve builds confidence and
              brings you closer to your dreams.
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{goals.length}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedGoals.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeGoals.length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("GoalEditor")}
        >
          <Ionicons name="add" size={18} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Add New Goal</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {activeGoals.map((goal) => {
            const colors = categoryColors[goal.category] || {
              background: COLORS.gray[100],
              text: COLORS.textPrimary,
            };
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View
                    style={[
                      styles.goalIcon,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Ionicons name="school" size={18} color={colors.text} />
                  </View>
                  <View style={styles.goalMeta}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <View style={styles.goalTagRow}>
                      <Text
                        style={[
                          styles.goalTag,
                          {
                            color: colors.text,
                            backgroundColor: colors.background,
                          },
                        ]}
                      >
                        {goal.category}
                      </Text>
                      <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${goal.progress}%`,
                        backgroundColor: colors.text,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  {goal.progress}% complete
                </Text>
                <View style={styles.goalActionsRow}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate("GoalEditor", { goal })}
                  >
                    <Text style={styles.optionButtonText}>Update Progress</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate("GoalEditor", { goal })}
                  >
                    <Text style={styles.optionButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {completedGoals.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.sectionSubtitle}>Completed</Text>
              {completedGoals.map((goal) => (
                <View
                  key={goal.id}
                  style={[styles.goalCard, styles.completedGoalCard]}
                >
                  <View style={[styles.goalHeader, { alignItems: "center" }]}>
                    <View
                      style={[
                        styles.completedIcon,
                        { backgroundColor: COLORS.success + "20" },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.success}
                      />
                    </View>
                    <View style={styles.goalMeta}>
                      <Text
                        style={[
                          styles.goalTitle,
                          { color: COLORS.textSecondary },
                        ]}
                      >
                        {goal.title}
                      </Text>
                      <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>Remember</Text>
          <View style={styles.reminderItem}>
            <View style={styles.reminderDot} />
            <Text style={styles.reminderText}>
              Every decision you make today affects your future goals.
            </Text>
          </View>
          <View style={styles.reminderItem}>
            <View style={styles.reminderDot} />
            <Text style={styles.reminderText}>
              Protecting your education means protecting your dreams.
            </Text>
          </View>
          <View style={styles.reminderItem}>
            <View style={styles.reminderDot} />
            <Text style={styles.reminderText}>
              You deserve a bright future — don't let anyone compromise it.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  headerText: {
    paddingRight: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#FBCFE8",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    marginTop: -24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  infoIcon: { marginRight: 12 },
  infoTextWrapper: { flex: 1 },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.coral[600],
    marginHorizontal: 20,
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  section: { marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  completedSection: { marginTop: 12 },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  completedGoalCard: {
    backgroundColor: "#F8FAFC",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  completedIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  goalMeta: { flex: 1 },
  goalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  goalTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginHorizontal: -4,
  },
  goalTag: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  goalDeadline: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray[200],
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  goalActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  optionButton: {
    flex: 1,
    borderColor: COLORS.gray[200],
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  optionButtonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  reminderCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.teal[800],
    marginBottom: 12,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  reminderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.teal[600],
    marginTop: 6,
    marginRight: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default GoalsScreen;
