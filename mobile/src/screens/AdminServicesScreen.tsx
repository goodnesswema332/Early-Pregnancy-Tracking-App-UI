import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAdmin } from "../context/AdminContext";
import { Ionicons } from "@expo/vector-icons";

const AdminServicesScreen = ({ navigation }: any) => {
  const { services, addService, removeService } = useAdmin();
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleAddService = () => {
    if (!name.trim() || !type.trim()) return;
    try {
      addService({ name, type, address: "TBD", phone: "TBD", services: [] });
      setName("");
      setType("");
      Alert.alert("Success", "Service added to the directory.");
    } catch (err) {
      Alert.alert("Error", "You are not authorized to create content.");
    }
  };

  const handleRemove = (id: string) => {
    const success = removeService(id);
    if (!success) {
      Alert.alert(
        "Error",
        "Unable to remove this service (it may be protected or you lack privileges).",
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.type}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Health Services</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Service Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Service Type (e.g. Clinic)"
          value={type}
          onChangeText={setType}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 16 },
  inputContainer: { padding: 16, backgroundColor: "#FFF", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#0D9488",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: "bold", color: "#1F2937" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});

export default AdminServicesScreen;
