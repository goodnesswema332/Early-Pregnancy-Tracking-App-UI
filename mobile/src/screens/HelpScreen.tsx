import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.note}>
        If you need help, visit the FAQ or contact support.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  note: { color: COLORS.textSecondary },
});

export default HelpScreen;
