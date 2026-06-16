import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const quickAccessItems = [
    { title: "Learn", icon: "book", screen: "Learn", color: COLORS.teal[600] },
    {
      title: "Quiz & Games",
      icon: "game-controller",
      screen: "Play",
      color: COLORS.coral[600],
    },
    {
      title: "Anonymous Chat",
      icon: "chatbubbles",
      screen: "Chat",
      color: COLORS.info,
    },
    {
      title: "Find Help",
      icon: "medkit",
      screen: "HealthServices",
      color: "#9333EA",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey there! 👋</Text>
          <Text style={styles.subtitle}>
            Your safe space for learning and growth
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Day {user?.progress?.streak || 0}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Daily Tip */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color={COLORS.coral[500]} />
            <Text style={styles.cardTitle}>Today's Insight</Text>
          </View>
          <Text style={styles.tipText}>
            "Understanding your body is the first step to making informed
            choices. Knowledge empowers you to take control of your health and
            future."
          </Text>
        </View>

        {/* Progress Tracker */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy" size={20} color={COLORS.teal[600]} />
            <Text style={styles.cardTitle}>Your Learning Progress</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "42%" }]} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="ribbon" size={16} color="#F59E0B" />
              <Text style={styles.statValue}>3 earned</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={16} color={COLORS.info} />
              <Text style={styles.statValue}>
                {user?.progress?.streak || 0} days
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* My Goals Preview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="star" size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>My Future Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Goals")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.goalItem}>
            <View style={styles.bullet} />
            <Text style={styles.goalText}>
              Complete high school with good grades
            </Text>
          </View>
        </View>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Explore Features</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccessItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAccessItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons
                name={item.icon as any}
                size={32}
                color={COLORS.white}
              />
              <Text style={styles.quickAccessText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Notice */}
        <View style={[styles.card, styles.privacyCard]}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.info} />
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Your privacy matters</Text>
            <Text style={styles.privacyText}>
              Everything you do here is private and confidential. We're here to
              support you with accurate information.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.teal[600],
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.teal[100],
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.teal[600],
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.teal[600],
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
    marginTop: 6,
    marginRight: 8,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  quickAccessItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 8,
    textAlign: "center",
  },
  privacyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.info + "10",
  },
  privacyContent: {
    flex: 1,
    marginLeft: 12,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.info,
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default DashboardScreen;
