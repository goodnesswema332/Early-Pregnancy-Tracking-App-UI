import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

import DashboardScreen from "../screens/DashboardScreen";
import EducationalLibraryScreen from "../screens/EducationalLibraryScreen";
import MiniGamesHubScreen from "../screens/MiniGamesHubScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AdminManagementScreen from "../screens/AdminManagementScreen";
import { useAdmin } from "../context/AdminContext";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { currentAdmin } = useAdmin();
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Learn") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Play") {
            iconName = focused ? "game-controller" : "game-controller-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.teal[600],
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Learn" component={EducationalLibraryScreen} />
      <Tab.Screen name="Play" component={MiniGamesHubScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {currentAdmin && (
        <Tab.Screen name="Admin" component={AdminManagementScreen} />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
