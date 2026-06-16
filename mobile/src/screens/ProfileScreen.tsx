import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import {
  useAdmin,
  validateEmail,
  validatePassword,
} from "../context/AdminContext";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const {
    currentAdmin,
    adminLogin,
    adminRegister,
    signOutAdmin,
    canAccessAdminPanel,
  } = useAdmin();

  const insets = useSafeAreaInsets();

  // Admin Portal Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "agent">("agent");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const userName = user?.name ?? "Guest";
  const streak = user?.progress?.streak ?? 5;
  const badges = user?.progress?.badgesEarned?.length ?? 3;
  const completion =
    user?.progress?.modulesCompleted && user?.progress?.totalModules
      ? Math.round(
          (user.progress.modulesCompleted / user.progress.totalModules) * 100,
        )
      : 42;

  const resetAdminForm = () => {
    setAdminEmail("");
    setAdminPassword("");
    setAdminName("");
    setSelectedRole("agent");
    setPasswordError("");
    setIsLoginMode(true);
  };

  const handleCloseModal = () => {
    setShowAdminModal(false);
    resetAdminForm();
  };

  const handleAdminLogin = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!validateEmail(adminEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(adminEmail.trim(), adminPassword.trim());
      if (result.success) {
        handleCloseModal();
        navigation.navigate("AdminManagement");
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegister = async () => {
    // Validation
    if (!adminName.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!validateEmail(adminEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const passwordCheck = validatePassword(adminPassword);
    if (!passwordCheck.valid) {
      setPasswordError(passwordCheck.message);
      Alert.alert("Invalid Password", passwordCheck.message);
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminRegister(
        adminName.trim(),
        adminEmail.trim(),
        adminPassword.trim(),
        selectedRole,
      );
      Alert.alert(
        result.success ? "Success" : "Registration Failed",
        result.message,
      );
      if (result.success) {
        setIsLoginMode(true);
        setAdminPassword("");
        setPasswordError("");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAdminPanel = () => {
    if (canAccessAdminPanel()) {
      navigation.navigate("AdminManagement");
    } else {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access the admin panel.",
      );
    }
  };

  const navigateToSuperAdminPanel = () => {
    if (currentAdmin?.role === "super") {
      navigation.navigate("SuperAdminManagement");
    } else {
      Alert.alert(
        "Access Denied",
        "This area is restricted to Super Administrators only.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 32 + insets.bottom },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{userName}</Text>
            <Text style={styles.subtitle}>Learning since May 2026</Text>
            {currentAdmin && (
              <View style={styles.adminBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={COLORS.white}
                />
                <Text style={styles.adminBadgeText}>
                  {currentAdmin.role === "super"
                    ? "Super Admin"
                    : currentAdmin.role === "admin"
                      ? "Admin"
                      : "Agent"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statsBlock}>
              <Ionicons name="trending-up" size={24} color={COLORS.teal[600]} />
              <Text style={styles.statsValue}>{streak}</Text>
              <Text style={styles.statsLabel}>Day Streak</Text>
            </View>
            <View style={styles.statsBlock}>
              <Ionicons name="ribbon" size={24} color={COLORS.coral[600]} />
              <Text style={styles.statsValue}>{badges}</Text>
              <Text style={styles.statsLabel}>Badges</Text>
            </View>
            <View style={styles.statsBlock}>
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color={COLORS.info}
              />
              <Text style={styles.statsValue}>{completion}%</Text>
              <Text style={styles.statsLabel}>Complete</Text>
            </View>
          </View>
        </View>

        {/* Admin Portal Section - Shown if admin is logged in */}
        {currentAdmin && (
          <View style={styles.adminPortalCard}>
            <View style={styles.adminPortalHeader}>
              <Ionicons name="shield" size={24} color={COLORS.coral[600]} />
              <Text style={styles.adminPortalTitle}>Admin Portal</Text>
            </View>
            <Text style={styles.adminPortalSubtitle}>
              Logged in as {currentAdmin.name} ({currentAdmin.role})
            </Text>
            <TouchableOpacity
              style={styles.adminPortalBtn}
              onPress={navigateToAdminPanel}
            >
              <Text style={styles.adminPortalBtnText}>
                Open Admin Dashboard
              </Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
            {currentAdmin.role === "super" && (
              <TouchableOpacity
                style={[
                  styles.adminPortalBtn,
                  { backgroundColor: COLORS.coral[700], marginTop: 8 },
                ]}
                onPress={navigateToSuperAdminPanel}
              >
                <Text style={styles.adminPortalBtnText}>Super Admin Panel</Text>
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.adminSignOutBtn}
              onPress={signOutAdmin}
            >
              <Text style={styles.adminSignOutText}>Sign Out from Admin</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Admin Portal Entry - Shown if no admin is logged in */}
        {!currentAdmin && (
          <View style={styles.adminPortalCard}>
            <View style={styles.adminPortalHeader}>
              <Ionicons
                name="shield-outline"
                size={24}
                color={COLORS.coral[600]}
              />
              <Text style={styles.adminPortalTitle}>Admin Portal</Text>
            </View>
            <Text style={styles.adminPortalSubtitle}>
              Access administrative functions and manage content
            </Text>
            <TouchableOpacity
              style={styles.adminPortalBtn}
              onPress={() => setShowAdminModal(true)}
            >
              <Text style={styles.adminPortalBtnText}>Access Admin Portal</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Badge Card */}
        <View style={styles.badgeCard}>
          <Text style={styles.cardTitle}>Earned Badges</Text>
          <Text style={styles.cardSubtitle}>Keep learning to unlock more!</Text>
          <View style={styles.badgeRow}>
            <View
              style={[styles.badgeItem, { backgroundColor: COLORS.teal[400] }]}
            >
              <Ionicons name="star" size={24} color={COLORS.white} />
              <Text style={styles.badgeText}>First Steps</Text>
            </View>
            <View
              style={[styles.badgeItem, { backgroundColor: COLORS.coral[400] }]}
            >
              <Ionicons name="trophy" size={24} color={COLORS.white} />
              <Text style={styles.badgeText}>Quiz Master</Text>
            </View>
            <View style={[styles.badgeItem, { backgroundColor: COLORS.info }]}>
              <Ionicons name="rocket" size={24} color={COLORS.white} />
              <Text style={styles.badgeText}>On Fire</Text>
            </View>
          </View>
          <View style={styles.progressWrap}>
            <Text style={styles.progressLabel}>
              Next badge: Complete 10 quizzes
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "70%" }]} />
            </View>
            <Text style={styles.progressStatus}>7/10 completed</Text>
          </View>
        </View>

        {/* Settings Card */}
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="person" size={20} color={COLORS.teal[600]} />
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications" size={20} color={COLORS.teal[600]} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings" size={20} color={COLORS.teal[600]} />
            <Text style={styles.settingText}>App Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Help")}
          >
            <Ionicons name="help-circle" size={20} color={COLORS.teal[600]} />
            <Text style={styles.settingText}>Help & Support</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutButton]}
            onPress={logout}
          >
            <Ionicons name="log-out" size={20} color={COLORS.coral[700]} />
            <Text style={[styles.settingText, { color: COLORS.coral[700] }]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerText}>
          <Text style={styles.footerLabel}>Early Pregnancy Tracking App</Text>
          <Text style={styles.footerLabelSecondary}>Version 1.0.0</Text>
        </View>

        {/* Admin Portal Modal */}
        <Modal
          visible={showAdminModal}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>
                    {isLoginMode ? "Admin Login" : "Register as Admin"}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {isLoginMode
                      ? "Enter your credentials to continue"
                      : "Create a new admin account"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <ScrollView
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
              >
                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.gray[400]}
                      value={adminName}
                      onChangeText={setAdminName}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.gray[400]}
                    value={adminEmail}
                    onChangeText={setAdminEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={
                      isLoginMode ? "Enter your password" : "Create a password"
                    }
                    placeholderTextColor={COLORS.gray[400]}
                    value={adminPassword}
                    onChangeText={(text) => {
                      setAdminPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry
                  />
                  {!isLoginMode && (
                    <View style={styles.passwordHints}>
                      <Text style={styles.passwordHintTitle}>
                        Password requirements:
                      </Text>
                      <Text style={styles.passwordHint}>
                        • Minimum 8 characters
                      </Text>
                      <Text style={styles.passwordHint}>
                        • At least one uppercase letter
                      </Text>
                      <Text style={styles.passwordHint}>
                        • At least one lowercase letter
                      </Text>
                      <Text style={styles.passwordHint}>
                        • At least one number
                      </Text>
                      <Text style={styles.passwordHint}>
                        • At least one special character (!@#$%^&*)
                      </Text>
                    </View>
                  )}
                </View>

                {!isLoginMode && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Role</Text>
                    <View style={styles.roleSelector}>
                      <TouchableOpacity
                        style={[
                          styles.roleOption,
                          selectedRole === "admin" && styles.roleOptionActive,
                        ]}
                        onPress={() => setSelectedRole("admin")}
                      >
                        <Ionicons
                          name={
                            selectedRole === "admin"
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={20}
                          color={
                            selectedRole === "admin"
                              ? COLORS.coral[600]
                              : COLORS.gray[400]
                          }
                        />
                        <View style={styles.roleOptionText}>
                          <Text
                            style={[
                              styles.roleOptionTitle,
                              selectedRole === "admin" &&
                                styles.roleOptionTitleActive,
                            ]}
                          >
                            Admin
                          </Text>
                          <Text style={styles.roleOptionDesc}>
                            Full content management access
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.roleOption,
                          selectedRole === "agent" && styles.roleOptionActive,
                        ]}
                        onPress={() => setSelectedRole("agent")}
                      >
                        <Ionicons
                          name={
                            selectedRole === "agent"
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={20}
                          color={
                            selectedRole === "agent"
                              ? COLORS.coral[600]
                              : COLORS.gray[400]
                          }
                        />
                        <View style={styles.roleOptionText}>
                          <Text
                            style={[
                              styles.roleOptionTitle,
                              selectedRole === "agent" &&
                                styles.roleOptionTitleActive,
                            ]}
                          >
                            Agent
                          </Text>
                          <Text style={styles.roleOptionDesc}>
                            Chat support and user assistance
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    isLoading && styles.submitBtnDisabled,
                  ]}
                  onPress={isLoginMode ? handleAdminLogin : handleAdminRegister}
                  disabled={isLoading}
                >
                  <Text style={styles.submitBtnText}>
                    {isLoading
                      ? "Please wait..."
                      : isLoginMode
                        ? "Login"
                        : "Submit Application"}
                  </Text>
                </TouchableOpacity>

                {/* Toggle Mode */}
                <TouchableOpacity
                  style={styles.toggleModeBtn}
                  onPress={() => {
                    setIsLoginMode(!isLoginMode);
                    setPasswordError("");
                  }}
                >
                  <Text style={styles.toggleModeText}>
                    {isLoginMode
                      ? "Don't have an account? Apply to become an admin"
                      : "Already have an account? Login"}
                  </Text>
                </TouchableOpacity>

                {/* Note for registration */}
                {!isLoginMode && (
                  <View style={styles.registrationNote}>
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color={COLORS.info}
                    />
                    <Text style={styles.registrationNoteText}>
                      Your application will be reviewed by a Super Admin before
                      you can access the admin panel.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: 32 },
  header: {
    backgroundColor: COLORS.teal[600],
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: COLORS.teal[700],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerText: { paddingLeft: 12 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: COLORS.teal[100] },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  adminBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    marginTop: -24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statsBlock: { alignItems: "center", flex: 1 },
  statsValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statsLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  adminPortalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  adminPortalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  adminPortalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  adminPortalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  adminPortalBtn: {
    backgroundColor: COLORS.coral[600],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  adminPortalBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  adminSignOutBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  adminSignOutText: {
    color: COLORS.coral[700],
    fontSize: 14,
    fontWeight: "600",
  },
  badgeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  badgeItem: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  badgeText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
  },
  progressWrap: { marginTop: 10 },
  progressLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  progressBar: {
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.gray[200],
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: COLORS.teal[600] },
  progressStatus: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 18,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  settingText: {
    marginLeft: 14,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 10,
  },
  logoutButton: { marginTop: 4 },
  footerText: { alignItems: "center", marginTop: 24 },
  footerLabel: { fontSize: 12, color: COLORS.textSecondary },
  footerLabelSecondary: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 34,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  modalForm: {
    maxHeight: "80%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  passwordHints: {
    marginTop: 10,
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 10,
  },
  passwordHintTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  roleSelector: {
    gap: 10,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleOptionActive: {
    borderColor: COLORS.coral[600],
    backgroundColor: COLORS.coral[50],
  },
  roleOptionText: {
    marginLeft: 12,
  },
  roleOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  roleOptionTitleActive: {
    color: COLORS.coral[600],
  },
  roleOptionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: COLORS.coral[600],
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  toggleModeBtn: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleModeText: {
    color: COLORS.coral[600],
    fontSize: 14,
    fontWeight: "600",
  },
  registrationNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E0F2FE",
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 10,
  },
  registrationNoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default ProfileScreen;
