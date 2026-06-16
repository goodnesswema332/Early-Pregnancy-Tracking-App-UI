import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

const storageKey = (userId: string) => `goals:${userId}`;

const GoalEditorScreen = ({ navigation, route }: any) => {
  const { user } = useAuth();
  const editing = route.params?.goal ?? null;
  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState(editing?.category ?? "Personal");
  const [deadline, setDeadline] = useState(editing?.deadline ?? "");
  const [progress, setProgress] = useState(String(editing?.progress ?? 0));

  useEffect(() => {
    if (!user) navigation.goBack();
  }, [user]);

  const save = async () => {
    if (!title.trim()) return Alert.alert("Title required");
    const key = storageKey(user!._id);
    const raw = await AsyncStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    if (editing) {
      const next = list.map((g: any) =>
        g.id === editing.id
          ? { ...g, title, category, deadline, progress: Number(progress) }
          : g,
      );
      await AsyncStorage.setItem(key, JSON.stringify(next));
    } else {
      const id = `goal-${Date.now()}`;
      const next = [
        ...list,
        {
          id,
          title,
          category,
          deadline,
          progress: Number(progress),
          completed: Number(progress) >= 100,
        },
      ];
      await AsyncStorage.setItem(key, JSON.stringify(next));
    }
    Alert.alert("Saved");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing ? "Edit Goal" : "Create Goal"}</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={styles.input}
        placeholderTextColor={COLORS.gray[400]}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
        style={styles.input}
        placeholderTextColor={COLORS.gray[400]}
      />
      <TextInput
        value={deadline}
        onChangeText={setDeadline}
        placeholder="Deadline"
        style={styles.input}
        placeholderTextColor={COLORS.gray[400]}
      />
      <TextInput
        value={progress}
        onChangeText={setProgress}
        placeholder="Progress (0-100)"
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor={COLORS.gray[400]}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  saveBtn: {
    backgroundColor: COLORS.teal[600],
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: COLORS.white, fontWeight: "700" },
});

export default GoalEditorScreen;
