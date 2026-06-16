import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import QuizGameScreen from "../screens/QuizGameScreen";
import FAQScreen from "../screens/FAQScreen";
import MythBustingScreen from "../screens/MythBustingScreen";
import AnonymousChatScreen from "../screens/AnonymousChatScreen";
import HealthServicesScreen from "../screens/HealthServicesScreen";
import GoalsScreen from "../screens/GoalsScreen";
import VideosScreen from "../screens/VideosScreen";
import VideoPlayerScreen from "../screens/VideoPlayerScreen";
import AdminChatDetailScreen from "../screens/AdminChatDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpScreen from "../screens/HelpScreen";
import TopicDetailScreen from "../screens/TopicDetailScreen";
import GoalEditorScreen from "../screens/GoalEditorScreen";
import AdminTopicsScreen from "../screens/AdminTopicsScreen";
import AdminFaqsScreen from "../screens/AdminFaqsScreen";
import SuperAdminManagementScreen from "../screens/SuperAdminManagementScreen";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loading } = useAuth();

  if (loading) {
    return null; // TODO: Add loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="QuizGame" component={QuizGameScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="MythBusting" component={MythBustingScreen} />
      <Stack.Screen name="Chat" component={AnonymousChatScreen} />
      <Stack.Screen name="HealthServices" component={HealthServicesScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="GoalEditor" component={GoalEditorScreen} />
      <Stack.Screen name="Videos" component={VideosScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="AdminChatDetail" component={AdminChatDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
      <Stack.Screen name="AdminTopics" component={AdminTopicsScreen} />
      <Stack.Screen name="AdminFaqs" component={AdminFaqsScreen} />
      <Stack.Screen
        name="SuperAdminManagement"
        component={SuperAdminManagementScreen}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
