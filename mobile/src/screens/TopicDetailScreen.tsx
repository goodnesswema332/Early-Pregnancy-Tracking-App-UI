import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import api from "../services/api";

const TopicDetailScreen = ({ route }: any) => {
  const { topic } = route.params || {};
  const [data, setData] = useState(topic || null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!topic?.id && route.params?.id) {
      (async () => {
        try {
          const res = await api.get(`/education/topics/${route.params.id}`);
          setData(res.data.data);
        } catch (_err) {
          // ignore
        }
      })();
    }
  }, []);

  if (!data)
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={{ color: COLORS.textSecondary }}>Loading...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 20 + insets.bottom,
        }}
      >
        <Text style={styles.title}>{data.title}</Text>
        {data.category && <Text style={styles.category}>{data.category}</Text>}
        {data.description && (
          <Text style={styles.description}>{data.description}</Text>
        )}
        {data.content && <Text style={styles.content}>{data.content}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  category: {
    fontSize: 12,
    color: COLORS.teal[700],
    fontWeight: "700",
    marginBottom: 12,
  },
  description: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
  content: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
});

export default TopicDetailScreen;
