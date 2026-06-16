declare module "@expo/vector-icons" {
  import React from "react";
  export const Ionicons: any;
  export default any;
}

declare module "expo-image-picker" {
  export function requestMediaLibraryPermissionsAsync(): Promise<any>;
  export function launchImageLibraryAsync(options?: any): Promise<any>;
  export default any;
}

declare module "expo-video" {
  export const Video: any;
  export default any;
}

declare module "expo-av" {
  export const Video: any;
  export default any;
}

declare module "expo-audio" {
  export const Audio: any;
  export default any;
}

declare module "react-native-webview" {
  import React from "react";
  export const WebView: any;
  export default any;
}

declare module "socket.io-client" {
  const io: any;
  export type Socket = any;
  export { io };
  export default io;
}

declare module "@react-navigation/native-stack" {
  const createNativeStackNavigator: any;
  export { createNativeStackNavigator };
  export default createNativeStackNavigator;
}

declare module "@react-navigation/bottom-tabs" {
  const createBottomTabNavigator: any;
  export { createBottomTabNavigator };
  export default createBottomTabNavigator;
}

declare module "expo-location" {
  export function requestForegroundPermissionsAsync(): Promise<any>;
  export function getCurrentPositionAsync(options?: any): Promise<any>;
  export const Accuracy: any;
  const Location: any;
  export default Location;
}
