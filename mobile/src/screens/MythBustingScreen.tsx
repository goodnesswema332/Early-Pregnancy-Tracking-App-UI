import React, { useState } from "react";
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
import { COLORS } from "../constants/colors";

const myths = [
  {
    id: "1",
    category: "Pregnancy Facts",
    myth: "You can't get pregnant the first time",
    truth:
      "FALSE - You can get pregnant any time you engage in sexual activity, including the first time.",
    explanation:
      "Once a girl starts menstruating, pregnancy is possible. The risk exists regardless of whether it is the first time or not. This is why understanding reproductive health and making informed decisions is crucial.",
  },
  {
    id: "2",
    category: "Pregnancy Facts",
    myth: "You can't get pregnant during your period",
    truth:
      "FALSE - While less likely, pregnancy can still occur during menstruation.",
    explanation:
      "Sperm can live inside the body for several days. If you have a short menstrual cycle, ovulation could occur soon after your period, making pregnancy possible. There is no completely safe time.",
  },
  {
    id: "3",
    category: "Prevention",
    myth: "Jumping up and down after sex prevents pregnancy",
    truth:
      "FALSE - Physical activities like jumping, douching, or urinating do not prevent pregnancy.",
    explanation:
      "Once conception occurs, no physical action can reverse it. The only sure way to prevent pregnancy is abstinence. Methods like these are dangerous myths that put young people at risk.",
  },
  {
    id: "4",
    category: "Education",
    myth: "Talking about reproductive health encourages sexual activity",
    truth:
      "FALSE - Education actually helps young people make safer, more informed decisions.",
    explanation:
      "Research shows that comprehensive reproductive health education delays sexual activity and reduces teen pregnancy rates. Knowledge empowers you to make responsible choices about your future.",
  },
  {
    id: "5",
    category: "Health",
    myth: "You can tell if someone has an STI by looking at them",
    truth:
      "FALSE - Many sexually transmitted infections have no visible symptoms.",
    explanation:
      "STIs often have no obvious signs, which is why they spread so easily. This is another reason why abstinence until you are ready is the safest choice for young people.",
  },
  {
    id: "6",
    category: "Pregnancy Facts",
    myth: "You can't get pregnant if you don't reach orgasm",
    truth: "FALSE - Pregnancy has nothing to do with orgasm or pleasure.",
    explanation:
      "Pregnancy occurs when sperm meets egg, regardless of anyone’s feelings or physical sensations. This myth is completely false and dangerously misleading.",
  },
  {
    id: "7",
    category: "Education",
    myth: "Only 'bad girls' need reproductive health information",
    truth: "FALSE - Every young person deserves accurate health information.",
    explanation:
      "Seeking knowledge about your body and health is responsible and smart, not shameful. Understanding reproductive health helps you protect your future and make informed decisions.",
  },
  {
    id: "8",
    category: "Prevention",
    myth: "Early pregnancy isn't that serious",
    truth:
      "FALSE - Early pregnancy has serious consequences for health, education, and future opportunities.",
    explanation:
      "Teen mothers are more likely to drop out of school, face health complications, experience poverty, and have limited career options. Early pregnancy affects not just you, but your entire future and your family.",
  },
  {
    id: "9",
    category: "Health",
    myth: "You can't get pregnant while breastfeeding",
    truth:
      "FALSE - Breastfeeding is not a reliable form of pregnancy prevention.",
    explanation:
      "While breastfeeding can delay the return of menstruation, ovulation can occur before your period returns, making pregnancy possible. This myth has led to many unplanned pregnancies.",
  },
  {
    id: "10",
    category: "Support",
    myth: "I can't talk to my parents about reproductive health",
    truth:
      "FALSE - Many parents want to support their children but may need help starting the conversation.",
    explanation:
      "While it may feel awkward, most parents care deeply about your wellbeing and safety. They can be valuable sources of guidance. If talking to parents is difficult, seek help from trusted adults or youth-friendly health services.",
  },
];

const MythBustingScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedMyth, setSelectedMyth] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const categories = Array.from(new Set(myths.map((item) => item.category)));

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
            <Text style={styles.title}>Myth vs. Fact</Text>
            <Text style={styles.subtitle}>
              Learn the truth about common myths
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="warning"
            size={22}
            color={COLORS.coral[600]}
            style={styles.infoIcon}
          />
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Fight Misinformation</Text>
            <Text style={styles.infoText}>
              There are many dangerous myths about reproductive health spread
              through friends and social media. Let's separate fact from
              fiction.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Common Myths</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Fact-Checked</Text>
          </View>
        </View>

        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryLabel}>{category}</Text>
            {myths
              .filter((item) => item.category === category)
              .map((item) => {
                const isOpen = selectedMyth === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.mythCard, isOpen && styles.mythCardOpen]}
                    onPress={() => setSelectedMyth(isOpen ? null : item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.mythHeader}>
                      <View style={styles.mythBadge}>
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color={COLORS.coral[600]}
                        />
                      </View>
                      <Text style={styles.mythQuestion}>{item.myth}</Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={COLORS.teal[600]}
                      />
                    </View>
                    {isOpen && (
                      <View style={styles.mythDetail}>
                        <View style={styles.truthRow}>
                          <View style={styles.truthBadge}>
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color={COLORS.success}
                            />
                          </View>
                          <Text style={styles.truthText}>{item.truth}</Text>
                        </View>
                        <View style={styles.explanationCard}>
                          <Ionicons
                            name="bulb"
                            size={18}
                            color={COLORS.teal[600]}
                          />
                          <Text style={styles.explanationText}>
                            {item.explanation}
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        ))}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Have a myth to check?</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate("Chat")}
          >
            <Text style={styles.helpButtonText}>Ask via Anonymous Chat</Text>
          </TouchableOpacity>
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
  headerText: { paddingRight: 40 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#FED7AA" },
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
  infoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  categorySection: { marginHorizontal: 20, marginBottom: 14 },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.coral[700],
    marginBottom: 10,
  },
  mythCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  mythCardOpen: {
    borderColor: COLORS.coral[600],
    shadowColor: COLORS.coral[600],
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  mythHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  mythBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.coral[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mythQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  mythDetail: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 14,
  },
  truthRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  truthBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  truthText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.teal[700],
  },
  explanationCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  explanationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: COLORS.teal[600],
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  helpButtonText: { color: COLORS.white, fontWeight: "700" },
});

export default MythBustingScreen;
