import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/colors";
import api from "../services/api";
import { useAdmin } from "../context/AdminContext";

const AdminTopicsScreen = ({ navigation }: any) => {
  const { currentAdmin } = useAdmin();
  const [topics, setTopics] = useState<any[]>([]);
  const [_loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/education/topics");
      setTopics(res.data.data || []);
    } catch (_err) {
      Alert.alert("Error", "Unable to load topics");
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!currentAdmin) return Alert.alert("Unauthorized", "Sign in as admin");
    if (!newTitle.trim()) return Alert.alert("Title required");
    try {
      const res = await api.post("/education/topics", {
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      setTopics((prev) => [res.data.data, ...prev]);
      setNewTitle("");
      setNewDesc("");
      Alert.alert("Created");
    } catch (_err: any) {
      Alert.alert("Error", _err.response?.data?.message || "Failed");
    }
  };

  const remove = async (id: string) => {
    if (!currentAdmin) return Alert.alert("Unauthorized");
    try {
      await api.delete(`/education/topics/${id}`);
      setTopics((prev) => prev.filter((t) => t._id !== id));
      Alert.alert("Deleted");
    } catch (_err) {
      Alert.alert("Error deleting");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Educational Topics</Text>
      <View style={styles.formRow}>
        <TextInput
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="New topic title"
          style={styles.input}
          placeholderTextColor={COLORS.gray[400]}
        />
        <TextInput
          value={newDesc}
          onChangeText={setNewDesc}
          placeholder="Short description"
          style={styles.input}
          placeholderTextColor={COLORS.gray[400]}
        />
        <TouchableOpacity style={styles.createBtn} onPress={create}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Create</Text>
        </TouchableOpacity>
      </View>

      {topics.map((t) => (
        <View key={t._id} style={styles.topicRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicTitle}>{t.title}</Text>
            {t.description ? (
              <Text style={styles.topicDesc}>{t.description}</Text>
            ) : null}
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => navigation.navigate("TopicDetail", { topic: t })}
            >
              <Text style={{ color: COLORS.teal[600], fontWeight: "700" }}>
                View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { marginLeft: 8 }]}
              onPress={() => navigation.navigate("TopicDetail", { topic: t })}
            >
              <Text style={{ color: "#4B5563", fontWeight: "700" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.smallBtn,
                { marginLeft: 8, backgroundColor: "#FECACA" },
              ]}
              onPress={() => remove(t._id)}
            >
              <Text style={{ color: "#7F1D1D", fontWeight: "700" }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  formRow: { marginBottom: 12 },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  createBtn: {
    backgroundColor: COLORS.teal[600],
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  topicRow: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topicTitle: { fontWeight: "700" },
  topicDesc: { color: COLORS.textSecondary, marginTop: 4 },
  smallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
});

export default AdminTopicsScreen;
