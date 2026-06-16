import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

const quizData: Record<
  string,
  {
    title: string;
    questions: {
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  }
> = {
  "myth-vs-fact": {
    title: "Myth vs. Fact Challenge",
    questions: [
      {
        id: 1,
        question:
          "You can tell if you're pregnant just by looking at symptoms within the first week.",
        options: ["Myth", "Fact"],
        correctAnswer: 0,
        explanation:
          "Most pregnancy symptoms do not appear until at least 1-2 weeks after conception. Early symptoms are often similar to PMS and can be misleading.",
      },
      {
        id: 2,
        question:
          "Stress and irregular periods can affect menstrual cycles and pregnancy timing.",
        options: ["Myth", "Fact"],
        correctAnswer: 1,
        explanation:
          "Stress, changes in routine, and health factors can absolutely affect menstrual regularity and ovulation timing.",
      },
      {
        id: 3,
        question:
          "Home pregnancy tests are most accurate when taken first thing in the morning.",
        options: ["Myth", "Fact"],
        correctAnswer: 1,
        explanation:
          "Morning urine is most concentrated, which makes it easier for the test to detect pregnancy hormones, especially in early pregnancy.",
      },
      {
        id: 4,
        question: "You can't get pregnant during your period.",
        options: ["Myth", "Fact"],
        correctAnswer: 0,
        explanation:
          "While less common, it is possible to get pregnant during your period, especially if you have shorter or irregular cycles.",
      },
    ],
  },

  "health-trivia": {
    title: "Health & Wellness Trivia",
    questions: [
      {
        id: 1,
        question: "Which vitamin is important for fetal neural development?",
        options: ["Vitamin C", "Folic Acid", "Vitamin D", "Vitamin B12"],
        correctAnswer: 1,
        explanation:
          "Folic acid (a B vitamin) is crucial in early pregnancy for neural tube development.",
      },
      {
        id: 2,
        question: "Moderate exercise during pregnancy is generally considered:",
        options: ["Unsafe", "Beneficial", "Mandatory", "Harmful"],
        correctAnswer: 1,
        explanation:
          "Moderate exercise is typically beneficial and can help with mood, circulation, and recovery.",
      },
      {
        id: 3,
        question: "Which food should be avoided due to risk of listeria?",
        options: ["Raw fish", "Soft cheeses", "Citrus fruits", "Cooked grains"],
        correctAnswer: 1,
        explanation:
          "Soft, unpasteurized cheeses can harbor listeria and are best avoided during pregnancy.",
      },
    ],
  },

  "scenario-quiz": {
    title: "Real-Life Scenario Quiz",
    questions: [
      {
        id: 1,
        question: "If you miss one prenatal vitamin dose, you should:",
        options: [
          "Double the next dose",
          "Take the missed dose when you remember",
          "Skip it completely",
          "Stop taking vitamins",
        ],
        correctAnswer: 1,
        explanation:
          "Take the missed dose when you remember; do not double doses unless advised.",
      },
      {
        id: 2,
        question:
          "You experience light spotting early in pregnancy. Best immediate action:",
        options: [
          "Ignore it",
          "Contact healthcare provider",
          "Take painkillers",
          "Start heavy exercise",
        ],
        correctAnswer: 1,
        explanation:
          "Light spotting can be common but contact your provider to rule out complications.",
      },
      {
        id: 3,
        question:
          "Which support resource is best for finding local prenatal classes?",
        options: [
          "Local health department",
          "Random blogs",
          "Unmoderated forums",
          "None of the above",
        ],
        correctAnswer: 0,
        explanation:
          "Local health departments or hospitals often list accredited prenatal classes and resources.",
      },
    ],
  },

  "support-navigator": {
    title: "Support Navigator Mini-Quiz",
    questions: [
      {
        id: 1,
        question: "Which service helps with mental health support?",
        options: [
          "Counseling services",
          "Fast food",
          "Unverified apps",
          "Isolated forums",
        ],
        correctAnswer: 0,
        explanation:
          "Counseling and professional mental health services provide reliable support.",
      },
      {
        id: 2,
        question: "Where to find reliable pregnancy info online?",
        options: [
          "Peer-reviewed medical sites",
          "Random social posts",
          "Clickbait sites",
          "Unknown sources",
        ],
        correctAnswer: 0,
        explanation:
          "Choose trusted, evidence-based medical resources and official health sites.",
      },
    ],
  },
};

const QuizGameScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const gameId = route.params?.gameId ?? "myth-vs-fact";
  const quiz = quizData[gameId] || quizData["myth-vs-fact"];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = useMemo(
    () => ((currentQuestion + 1) / quiz.questions.length) * 100,
    [currentQuestion, quiz.questions.length],
  );

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <View style={[styles.container, styles.resultContainer]}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultSubtitle}>
            Great job on finishing the quiz
          </Text>
          <Text style={styles.resultScore}>
            {score}/{quiz.questions.length}
          </Text>
          <Text style={styles.resultPercent}>{percentage}% Score</Text>
          <TouchableOpacity
            style={[styles.primaryButton, styles.resultButton]}
            onPress={() =>
              navigation.navigate("Play", {
                gameResult: {
                  gameId,
                  score,
                  total: quiz.questions.length,
                  timestamp: Date.now(),
                },
              })
            }
          >
            <Text style={styles.primaryButtonText}>Back to Games</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.resultButton]}
            onPress={handleRestart}
          >
            <Text style={styles.secondaryButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 32 + insets.bottom },
        ]}
      >
        <View style={[styles.quizHeader, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Play")}
            style={styles.headerBackButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.quizHeaderText}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizSubtitle}>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>Score: {score}</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionCount}>
            Question {currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>

          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = showExplanation;

            const optionStyle: any[] = [styles.optionButton];
            const optionTextStyle: any[] = [styles.optionButtonText];

            if (!showResult) {
              if (isSelected) {
                optionStyle.push(styles.optionSelected);
                optionTextStyle.push(styles.optionSelectedText);
              }
            } else {
              if (isCorrect) {
                optionStyle.push(styles.optionCorrect);
                optionTextStyle.push(styles.optionCorrectText);
              } else if (isSelected && !isCorrect) {
                optionStyle.push(styles.optionIncorrect);
                optionTextStyle.push(styles.optionIncorrectText);
              } else {
                optionStyle.push(styles.optionDisabled);
                optionTextStyle.push(styles.optionDisabledText);
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleAnswerSelect(index)}
                activeOpacity={0.85}
                disabled={showExplanation}
              >
                <Text style={optionTextStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}

          {showExplanation && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Did you know?</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              selectedAnswer === null && styles.disabledButton,
            ]}
            onPress={showExplanation ? handleNext : handleSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.primaryButtonText}>
              {showExplanation
                ? currentQuestion < quiz.questions.length - 1
                  ? "Next Question"
                  : "See Results"
                : "Submit Answer"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: 32 },
  quizHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray[200],
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quizHeaderText: { marginBottom: 10 },
  quizTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  quizSubtitle: { fontSize: 13, color: COLORS.textSecondary },
  scoreBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  scoreBadgeText: { color: "#3730A3", fontSize: 12, fontWeight: "700" },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray[200],
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 12,
  },
  progressFill: { height: "100%", backgroundColor: "#7C3AED" },
  questionCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
  },
  questionCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 18,
    lineHeight: 26,
  },
  optionButton: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionButtonText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  optionSelected: { backgroundColor: "#EDE9FE" },
  optionSelectedText: { color: "#3730A3" },
  optionCorrect: { backgroundColor: "#DCFCE7" },
  optionCorrectText: { color: "#166534" },
  optionIncorrect: { backgroundColor: "#FECACA" },
  optionIncorrectText: { color: "#B91C1C" },
  optionDisabled: { backgroundColor: COLORS.gray[50] },
  optionDisabledText: { color: COLORS.textSecondary },
  explanationCard: {
    marginTop: 16,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    padding: 16,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D4ED8",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.teal[600],
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
  disabledButton: { backgroundColor: COLORS.gray[300] },
  resultContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },
  resultEmoji: { fontSize: 48, marginBottom: 16 },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  resultScore: {
    fontSize: 36,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 8,
  },
  resultPercent: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 24 },
  resultButton: { width: "100%" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
    marginTop: 12,
  },
  secondaryButtonText: { color: COLORS.textPrimary },
});

export default QuizGameScreen;
