// AdminGamesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useAdmin } from "../context/AdminContext";

const AdminGamesScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { games, addGame, removeGame, hasPrivilege } = useAdmin();

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Wellness");
  const [newDescription, setNewDescription] = useState("");
  const [newPoints, setNewPoints] = useState("50");

  const handleAddContent = () => {
    if (!newTitle.trim() || !newDescription.trim() || !newCategory.trim()) {
      return Alert.alert(
        "Incomplete",
        "Please provide a title, category, and description.",
      );
    }
    if (!hasPrivilege("canCreateContent")) {
      return Alert.alert(
        "Unauthorized",
        "You do not have permission to add games.",
      );
    }

    addGame({
      title: newTitle.trim(),
      description: newDescription.trim(),
      difficulty: "Medium",
      points: Number(newPoints) || 50,
      completed: false,
      color: COLORS.teal[600],
      category: newCategory,
      icon: "game-controller",
    });

    setNewTitle("");
    setNewDescription("");
    setNewPoints("50");
    setNewCategory("Wellness");
    Alert.alert("Success", "Game module published.");
  };

  const handleRemoveGame = (id: string) => {
    Alert.alert("Delete", "Remove this game module?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeGame(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Manage Mini-Games</Text>
            <Text style={styles.subtitle}>Deploy interactive modules</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Add New Module</Text>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Game Title"
            style={styles.input}
          />
          <TextInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="Category (e.g. Wellness)"
            style={styles.input}
          />
          <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Description"
            multiline
            style={[styles.input, { height: 80 }]}
          />
          <TextInput
            value={newPoints}
            onChangeText={setNewPoints}
            placeholder="Points Value"
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddContent}>
            <Text style={styles.submitBtnText}>Publish Module</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Active Modules</Text>
          {games.length === 0 && (
            <Text style={styles.note}>No modules deployed.</Text>
          )}
          {games.map((g) => (
            <View key={g.id} style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{g.title}</Text>
                <Text style={styles.rowSub}>
                  {g.category} • {g.points} pts
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveGame(g.id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.coral[600],
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.white },
  subtitle: { color: "#FECACA", fontSize: 13 },
  panel: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: COLORS.coral[600],
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnText: { color: COLORS.white, fontWeight: "700" },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowTitle: { fontWeight: "600", color: COLORS.textPrimary },
  rowSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  deleteBtn: { padding: 8, backgroundColor: "#FEE2E2", borderRadius: 8 },
  note: { color: COLORS.textSecondary, fontStyle: "italic" },
});

export default AdminGamesScreen;
