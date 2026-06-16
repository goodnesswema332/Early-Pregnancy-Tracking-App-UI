import React from "react";
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
import { useEffect, useState } from "react";
import api from "../services/api";
import { COLORS } from "../constants/colors";

const defaultTopics = [
  {
    id: "1",
    title: "Understanding Your Body",
    description:
      "Learn about reproductive health and body changes during adolescence",
    category: "Health Basics",
    completed: true,
  },
  {
    id: "2",
    title: "Early Pregnancy Signs",
    description:
      "Recognizing the physical and emotional signs of early pregnancy",
    category: "Awareness",
  },
  {
    id: "3",
    title: "Mental Health & Wellness",
    description:
      "Taking care of your emotional wellbeing during challenging times",
    category: "Mental Health",
  },
  {
    id: "4",
    title: "Nutrition & Self-Care",
    description:
      "Essential nutrition tips and self-care practices for your health",
    category: "Wellness",
  },
  {
    id: "5",
    title: "Support Systems",
    description:
      "How to talk to trusted adults and find support when you need it",
    category: "Support",
  },
  {
    id: "6",
    title: "Your Rights & Safety",
    description: "Understanding your rights and staying safe in any situation",
    category: "Safety",
  },
];

const EducationalLibraryScreen = () => {
  const navigation = useNavigation<any>();
  const [topics, setTopics] = useState<any[]>(defaultTopics);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/education/topics");
        if (res.data?.data) setTopics(res.data.data);
      } catch (_err) {
        // leave default topics
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 32 + insets.bottom },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Educational Library</Text>
            <Text style={styles.subtitle}>Learn at your own pace</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionBlue]}
            onPress={() => navigation.navigate("FAQ")}
          >
            <Ionicons name="help-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionRed]}
            onPress={() => navigation.navigate("MythBusting")}
          >
            <Ionicons name="alert-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Myths</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionPurple]}
            onPress={() => navigation.navigate("Videos")}
          >
            <Ionicons name="play-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Videos</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Educational Topics</Text>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic._id ?? topic.id}
            style={styles.topicCard}
            onPress={() => navigation.navigate("TopicDetail", { topic })}
          >
            <View style={styles.topicMeta}>
              <Text style={styles.topicCategory}>{topic.category}</Text>
              {topic.completed && <Text style={styles.topicBadge}>Done</Text>}
            </View>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicDescription}>{topic.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Keep Learning!</Text>
          <Text style={styles.tipDescription}>
            New educational content is added regularly. Check back soon for
            fresh topics and helpful resources.
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
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.teal[600],
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
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  actionCard: {
    width: "32%",
    minHeight: 92,
    borderRadius: 18,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionBlue: {
    backgroundColor: COLORS.info,
  },
  actionRed: {
    backgroundColor: COLORS.coral[600],
  },
  actionPurple: {
    backgroundColor: "#9333EA",
  },
  actionText: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  topicMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topicCategory: {
    fontSize: 11,
    color: COLORS.teal[700],
    fontWeight: "700",
  },
  topicBadge: {
    fontSize: 11,
    color: COLORS.white,
    backgroundColor: COLORS.teal[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: "#EEF2FF",
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
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.teal[800],
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default EducationalLibraryScreen;
