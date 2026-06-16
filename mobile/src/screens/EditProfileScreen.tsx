import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

const EditProfileScreen = ({ navigation }: any) => {
  const { user, editProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");

  const save = async () => {
    if (!name.trim()) return Alert.alert("Name required");
    await editProfile({ name: name.trim() });
    Alert.alert("Saved");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
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

export default EditProfileScreen;
