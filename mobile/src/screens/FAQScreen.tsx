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

const faqs = [
  {
    id: "1",
    category: "Reproductive Health",
    question: "What is reproductive health education?",
    answer:
      "Reproductive health education teaches you about your body, how it works, and how to make informed decisions about your health and future. It includes understanding puberty, menstruation, relationships, and how to protect yourself.",
  },
  {
    id: "2",
    category: "Reproductive Health",
    question: "At what age can pregnancy occur?",
    answer:
      "Pregnancy can occur once a girl starts menstruating (having periods), which typically happens between ages 10-15. This is why it is crucial to understand your body and make informed decisions about relationships.",
  },
  {
    id: "3",
    category: "Prevention",
    question: "How can I prevent early pregnancy?",
    answer:
      "The most effective way is abstinence - choosing not to engage in sexual activity. Other important steps include focusing on your education, setting personal goals, seeking guidance from trusted adults, and avoiding peer pressure situations.",
  },
  {
    id: "4",
    category: "Education",
    question: "Why is education important for my future?",
    answer:
      "Education opens doors to career opportunities, financial independence, and a better quality of life. Completing your education helps you achieve your dreams, support yourself and your future family, and make informed life decisions.",
  },
  {
    id: "5",
    category: "Support",
    question: "Where can I get help if I have questions?",
    answer:
      "You can talk to trusted adults like parents, teachers, or school counselors. You can also visit youth-friendly health clinics in your area. Remember, seeking information and help is a sign of strength, not weakness.",
  },
  {
    id: "6",
    category: "Health Services",
    question: "What are youth-friendly health services?",
    answer:
      "These are health facilities that provide confidential, non-judgmental healthcare specifically designed for young people. They offer reproductive health information, counseling, and support in a safe and private environment.",
  },
  {
    id: "7",
    category: "Decision Making",
    question: "How do I handle peer pressure?",
    answer:
      "Remember your goals and values. Practice saying 'no' confidently. Surround yourself with friends who respect your choices. It's okay to walk away from situations that make you uncomfortable. Your future is more important than fitting in.",
  },
  {
    id: "8",
    category: "Consequences",
    question: "What are the consequences of early pregnancy?",
    answer:
      "Early pregnancy can lead to dropping out of school, health complications, limited career opportunities, financial challenges, and emotional stress. It affects not just you, but your family and your future child as well.",
  },
  {
    id: "9",
    category: "Goal Setting",
    question: "How can I set and achieve my life goals?",
    answer:
      "Start by identifying what you want to achieve (education, career, personal growth). Write down specific goals with timelines. Break them into smaller steps. Stay focused on your education, and avoid situations that could derail your plans.",
  },
  {
    id: "10",
    category: "Privacy",
    question: "Is my information private when I use this app?",
    answer:
      "Yes! This app is designed to protect your privacy. All your activity, learning progress, and any questions you ask are kept confidential. Your personal information is secure and not shared with anyone.",
  },
];

const FAQScreen = () => {
  const navigation = useNavigation<any>();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

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
            <Text style={styles.title}>Frequently Asked Questions</Text>
            <Text style={styles.subtitle}>Get answers to common questions</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="help-circle"
            size={22}
            color={COLORS.info}
            style={styles.infoIcon}
          />
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Have questions?</Text>
            <Text style={styles.infoText}>
              We've compiled answers to the most common questions about
              reproductive health, education, and making informed decisions. If
              you don't find what you're looking for, use our anonymous chat
              feature.
            </Text>
          </View>
        </View>

        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryLabel}>{category}</Text>
            {faqs
              .filter((faq) => faq.category === category)
              .map((faq) => {
                const isOpen = openItems.includes(faq.id);
                return (
                  <TouchableOpacity
                    key={faq.id}
                    onPress={() => toggleItem(faq.id)}
                    style={[styles.faqCard, isOpen && styles.faqCardOpen]}
                  >
                    <View style={styles.faqQuestionRow}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={COLORS.teal[600]}
                      />
                    </View>
                    {isOpen && (
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        ))}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>
            Didn't find what you were looking for?
          </Text>
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
  headerText: {
    paddingRight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#D9F0F8",
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
  infoIcon: {
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  categorySection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.teal[700],
    marginBottom: 10,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  faqCardOpen: {
    borderColor: COLORS.teal[600],
    shadowColor: COLORS.teal[600],
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  faqQuestionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: COLORS.teal[600],
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  helpButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});

export default FAQScreen;
