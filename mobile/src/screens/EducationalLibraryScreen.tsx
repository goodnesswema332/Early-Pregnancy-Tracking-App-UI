/**
 * WHAT DOES THIS ENTIRE FILE DO?
 * ------------------------------------------------------------------
 * Imagine you are walking into a library, but instead of physical books, 
 * it is on your phone. This file builds that digital "Educational Library" screen.
 * * It does three main things:
 * 1. It shows a list of learning topics (like "Health Basics" or "Safety").
 * 2. It tries to use the internet to get the newest topics. If there is no 
 * internet, it uses a backup list so the app doesn't break.
 * 3. It gives you buttons to tap so you can go read a topic, watch videos, 
 * or check out Frequently Asked Questions (FAQ).
 */

// ------------------------------------------------------------------
// PART 1: GATHERING OUR TOOLS
// ------------------------------------------------------------------
// Think of this like gathering your pencil, ruler, and paper before drawing.
import React from "react";
// We bring in tools to build the screen (like Text to write words, and ScrollView to let you scroll up and down)
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// This makes sure our app doesn't hide behind the phone's camera notch or battery icon
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// This brings in little pictures/icons (like a back arrow or a play button)
import { Ionicons } from "@expo/vector-icons";
// This tool helps us move from one screen to another (like turning a page)
import { useNavigation } from "@react-navigation/native";
// These help the app remember things and do things automatically
import { useEffect, useState } from "react";
// This is our messenger that talks to the internet to get new information
import api from "../services/api";
// This brings in the colors we want to use for our text and buttons
import { COLORS } from "../constants/colors";

// ------------------------------------------------------------------
// PART 2: OUR BACKUP PLAN (THE DEFAULT TOPICS)
// ------------------------------------------------------------------
// If the phone has no internet, we still want the student to learn something!
// So, we keep a small list of "backup" lessons saved right here in the app.
const defaultTopics = [
  {
    id: "1",
    title: "Understanding Your Body",
    description: "Learn about reproductive health and body changes during adolescence",
    category: "Health Basics",
    completed: true, // This means the student already finished this lesson
  },
  {
    id: "2",
    title: "Early Pregnancy Signs",
    description: "Recognizing the physical and emotional signs of early pregnancy",
    category: "Awareness",
  },
  {
    id: "3",
    title: "Mental Health & Wellness",
    description: "Taking care of your emotional wellbeing during challenging times",
    category: "Mental Health",
  },
  {
    id: "4",
    title: "Nutrition & Self-Care",
    description: "Essential nutrition tips and self-care practices for your health",
    category: "Wellness",
  },
  {
    id: "5",
    title: "Support Systems",
    description: "How to talk to trusted adults and find support when you need it",
    category: "Support",
  },
  {
    id: "6",
    title: "Your Rights & Safety",
    description: "Understanding your rights and staying safe in any situation",
    category: "Safety",
  },
];

// ------------------------------------------------------------------
// PART 3: BUILDING THE SCREEN
// ------------------------------------------------------------------
// This is the main part of our code where we actually build what you see.
const EducationalLibraryScreen = () => {
  // 'navigation' is our map. It helps us travel to other screens.
  const navigation = useNavigation<any>();
  
  // 'topics' is our memory box. Right now, we put our backup list inside it.
  // 'setTopics' is the tool we use to change what is inside the memory box later.
  const [topics, setTopics] = useState<any[]>(defaultTopics);
  
  // This checks the shape of your phone to make sure our app fits perfectly.
  const insets = useSafeAreaInsets();

  // useEffect is a special rule that says: "Do this as soon as the screen opens."
  useEffect(() => {
    // We create a mini-task to talk to the internet.
    (async () => {
      try {
        // We send our messenger ('api') to ask the server for the newest education topics.
        const res = await api.get("/education/topics");
        // If the server replies with new data, we put it in our 'topics' memory box!
        if (res.data?.data) setTopics(res.data.data);
      } catch (_err) {
        // If there is an error (like the internet is off), we do nothing. 
        // The app will just safely use the 'defaultTopics' we created earlier.
      }
    })(); // This weird little symbol () at the end means "run this mini-task right now".
  }, []); // The empty brackets [] mean "only do this once when the screen opens".

  // ------------------------------------------------------------------
  // PART 4: DRAWING THE STUFF ON THE SCREEN
  // ------------------------------------------------------------------
  // Everything inside 'return' is what actually shows up on your phone screen.
  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView lets us swipe up and down if the page is too long */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 32 + insets.bottom }, // Gives extra space at the very bottom so nothing gets cut off
        ]}
      >
        {/* --- THE TOP HEADER --- */}
        <View style={styles.header}>
          {/* A button to go back to the Home screen */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            {/* The little back arrow icon */}
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          {/* The main title at the top of the screen */}
          <View style={styles.headerText}>
            <Text style={styles.title}>Educational Library</Text>
            <Text style={styles.subtitle}>Learn at your own pace</Text>
          </View>
        </View>

        {/* --- THREE BIG ACTION BUTTONS --- */}
        {/* These three buttons are shortcuts to other parts of the app */}
        <View style={styles.actionsRow}>
          {/* Button 1: Goes to the FAQ (Frequently Asked Questions) screen */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionBlue]}
            onPress={() => navigation.navigate("FAQ")}
          >
            <Ionicons name="help-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>FAQ</Text>
          </TouchableOpacity>
          
          {/* Button 2: Goes to the MythBusting screen */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionRed]}
            onPress={() => navigation.navigate("MythBusting")}
          >
            <Ionicons name="alert-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Myths</Text>
          </TouchableOpacity>
          
          {/* Button 3: Goes to the Videos screen */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionPurple]}
            onPress={() => navigation.navigate("Videos")}
          >
            <Ionicons name="play-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Videos</Text>
          </TouchableOpacity>
        </View>

        {/* --- THE LIST OF LESSONS --- */}
        <Text style={styles.sectionTitle}>Educational Topics</Text>
        
        {/* We use '.map' to take our list of 'topics' and turn every single one 
          into a little tap-able card on the screen. 
        */}
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic._id ?? topic.id} // Every card needs a unique ID so the phone doesn't get confused
            style={styles.topicCard}
            // When you tap this card, it opens the "TopicDetail" screen and brings the topic's data with it
            onPress={() => navigation.navigate("TopicDetail", { topic })}
          >
            <View style={styles.topicMeta}>
              {/* Shows the category, like "Health Basics" */}
              <Text style={styles.topicCategory}>{topic.category}</Text>
              
              {/* If the student finished the lesson, show a tiny "Done" badge */}
              {topic.completed && <Text style={styles.topicBadge}>Done</Text>}
            </View>
            
            {/* Shows the big title of the lesson */}
            <Text style={styles.topicTitle}>{topic.title}</Text>
            {/* Shows the short description under the title */}
            <Text style={styles.topicDescription}>{topic.description}</Text>
          </TouchableOpacity>
        ))}

        {/* --- A FRIENDLY MESSAGE AT THE BOTTOM --- */}
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

// ------------------------------------------------------------------
// PART 5: THE STYLES (THE PAINT AND DECORATION)
// ------------------------------------------------------------------
// This part is like our paint bucket. It tells the app how big to make the words,
// what colors to paint the buttons, and how round to make the corners.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }, // The background color of the whole screen
  contentContainer: { paddingBottom: 32 }, 
  
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28, // Makes the bottom corners of the header rounded
    borderBottomRightRadius: 28,
    shadowColor: "#000", // Adds a nice little drop-shadow to make it look 3D
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12, // Makes the button a rounded square
    backgroundColor: COLORS.teal[600],
    justifyContent: "center", // Puts the arrow icon exactly in the middle
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    paddingRight: 40,
  },
  title: {
    fontSize: 26, // Makes the main title big and bold
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary, // A slightly lighter text color so it's not too loud
  },
  actionsRow: {
    flexDirection: "row", // Puts our three buttons side-by-side in a line
    flexWrap: "wrap",
    justifyContent: "space-between", // Spaces the buttons out evenly
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  actionCard: {
    width: "32%", // Each button takes up about a third of the screen width
    minHeight: 92,
    borderRadius: 18,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  // Here we set the specific colors for the three quick-action buttons
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
    color: COLORS.white, // White text so it shows up well against the dark buttons
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
    backgroundColor: COLORS.white, // Each lesson card is white
    borderRadius: 20, // Rounded corners for the card
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000", // A soft shadow behind the card
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  topicMeta: {
    flexDirection: "row",
    justifyContent: "space-between", // Puts category on the left, "Done" badge on the right
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
    backgroundColor: COLORS.teal[600], // Makes the "Done" badge teal
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
    lineHeight: 20, // Gives a little extra space between lines of text
  },
  tipCard: {
    backgroundColor: "#EEF2FF", // A very soft blue background
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

export default EducationalLibraryScreen; // We export the screen so the rest of the app can use it