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

const AdminFaqsScreen = ({ navigation }: any) => {
  const { currentAdmin } = useAdmin();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [_loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/education/faq");
      setFaqs(res.data.data || []);
    } catch (_err) {
      Alert.alert("Error", "Unable to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const create = async () => {
    if (!currentAdmin) return Alert.alert("Unauthorized", "Sign in as admin");
    if (!q.trim() || !a.trim())
      return Alert.alert("Missing", "Provide question and answer");
    try {
      const res = await api.post("/education/faq", {
        question: q.trim(),
        answer: a.trim(),
      });
      setFaqs((prev) => [res.data.data, ...prev]);
      setQ("");
      setA("");
      Alert.alert("Created");
    } catch (_err: any) {
      Alert.alert("Error", _err.response?.data?.message || "Failed");
    }
  };

  const remove = async (id: string) => {
    if (!currentAdmin) return Alert.alert("Unauthorized");
    try {
      await api.delete(`/education/faq/${id}`);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
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
      <Text style={styles.title}>Manage FAQs</Text>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Question"
        style={styles.input}
        placeholderTextColor={COLORS.gray[400]}
      />
      <TextInput
        value={a}
        onChangeText={setA}
        placeholder="Answer"
        style={[styles.input, { minHeight: 80 }]}
        multiline
        placeholderTextColor={COLORS.gray[400]}
      />
      <TouchableOpacity style={styles.createBtn} onPress={create}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Create FAQ</Text>
      </TouchableOpacity>

      {faqs.map((f) => (
        <View key={f._id} style={styles.faqRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.faqQ}>{f.question}</Text>
            <Text style={styles.faqA}>{f.answer}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() =>
                navigation.navigate("TopicDetail", {
                  topic: { title: f.question, content: f.answer },
                })
              }
            >
              <Text style={{ color: COLORS.teal[600], fontWeight: "700" }}>
                View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { marginLeft: 8 }]}
              onPress={() =>
                navigation.navigate("TopicDetail", {
                  topic: { title: f.question, content: f.answer },
                })
              }
            >
              <Text style={{ color: "#4B5563", fontWeight: "700" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.smallBtn,
                { marginLeft: 8, backgroundColor: "#FECACA" },
              ]}
              onPress={() => remove(f._id)}
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
    marginBottom: 12,
  },
  faqRow: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  faqQ: { fontWeight: "700" },
  faqA: { color: COLORS.textSecondary, marginTop: 4 },
  smallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
});

export default AdminFaqsScreen;
