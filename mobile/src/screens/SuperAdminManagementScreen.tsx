import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import {
  useAdmin,
  AdminRole,
  AdminUser,
  AdminPrivileges,
} from "../context/AdminContext";

const SuperAdminManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    currentAdmin,
    admins,
    pendingAdmins,
    approveAdmin,
    rejectAdmin,
    banAdmin,
    unbanAdmin,
    updateAdminRole,
    updateAdminPrivileges,
    removeAdmin,
    signOutAdmin,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);

  // Redirect if not super admin
  if (!currentAdmin || currentAdmin.role !== "super") {
    return (
      <SafeAreaView
        style={[
          styles.unauthorizedContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Ionicons name="lock-closed" size={64} color={COLORS.coral[600]} />
        <Text style={styles.unauthorizedTitle}>Access Denied</Text>
        <Text style={styles.unauthorizedText}>
          This area is restricted to Super Administrators only.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleApprove = (adminId: string, name: string) => {
    Alert.alert("Approve Admin", `Are you sure you want to approve ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          const success = approveAdmin(adminId);
          if (success) {
            Alert.alert("Success", `${name} has been approved.`);
          } else {
            Alert.alert("Error", "Failed to approve admin.");
          }
        },
      },
    ]);
  };

  const handleReject = (adminId: string, name: string) => {
    Alert.alert(
      "Reject Application",
      `Are you sure you want to reject ${name}'s application? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: () => {
            const success = rejectAdmin(adminId);
            if (success) {
              Alert.alert(
                "Success",
                `${name}'s application has been rejected.`,
              );
            } else {
              Alert.alert("Error", "Failed to reject application.");
            }
          },
        },
      ],
    );
  };

  const handleBan = (adminId: string, name: string) => {
    Alert.alert(
      "Ban Administrator",
      `Are you sure you want to ban ${name}? They will no longer be able to access the admin panel.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ban",
          onPress: () => {
            const success = banAdmin(adminId);
            if (success) {
              Alert.alert("Success", `${name} has been banned.`);
            } else {
              Alert.alert("Error", "Failed to ban admin.");
            }
          },
        },
      ],
    );
  };

  const handleUnban = (adminId: string, name: string) => {
    Alert.alert(
      "Unban Administrator",
      `Are you sure you want to unban ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unban",
          onPress: () => {
            const success = unbanAdmin(adminId);
            if (success) {
              Alert.alert("Success", `${name} has been unbanned.`);
            } else {
              Alert.alert("Error", "Failed to unban admin.");
            }
          },
        },
      ],
    );
  };

  const handleRoleChange = (
    adminId: string,
    name: string,
    currentRole: AdminRole,
  ) => {
    const roles: AdminRole[] = ["super", "admin", "agent"];
    const roleLabels: Record<AdminRole, string> = {
      super: "Super Admin",
      admin: "Admin",
      agent: "Agent",
    };

    Alert.alert(
      "Change Role",
      `Select new role for ${name}:`,
      roles
        .map((role) => ({
          text: roleLabels[role] + (role === currentRole ? " (Current)" : ""),
          onPress: () => {
            if (role !== currentRole) {
              const success = updateAdminRole(adminId, role);
              if (success) {
                Alert.alert(
                  "Success",
                  `${name} has been promoted to ${roleLabels[role]}.`,
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to update role. You cannot demote yourself from Super Admin.",
                );
              }
            }
          },
        }))
        .concat([{ text: "Cancel", onPress: () => {} }]),
    );
  };

  const handleRemove = (adminId: string, name: string) => {
    Alert.alert(
      "Remove Administrator",
      `Are you sure you want to permanently remove ${name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const success = removeAdmin(adminId);
            if (success) {
              Alert.alert("Success", `${name} has been removed.`);
            } else {
              Alert.alert(
                "Error",
                "Failed to remove admin. You cannot remove yourself.",
              );
            }
          },
        },
      ],
    );
  };

  const openPrivilegeEditor = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setShowPrivilegeModal(true);
  };

  const togglePrivilege = (privilege: keyof AdminPrivileges) => {
    if (!selectedAdmin) return;

    const newPrivileges = {
      ...selectedAdmin.privileges,
      [privilege]: !selectedAdmin.privileges[privilege],
    };

    const success = updateAdminPrivileges(selectedAdmin.id, {
      [privilege]: newPrivileges[privilege],
    });
    if (success) {
      setSelectedAdmin({ ...selectedAdmin, privileges: newPrivileges });
    }
  };

  const getRoleBadgeColor = (role: AdminRole) => {
    switch (role) {
      case "super":
        return COLORS.coral[600];
      case "admin":
        return COLORS.teal[600];
      case "agent":
        return COLORS.info;
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "banned":
        return "#EF4444";
      default:
        return COLORS.gray[500];
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPending = pendingAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: 40 + insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Super Admin Panel</Text>
          <Text style={styles.subtitle}>
            Manage administrators and permissions
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.gray[400]}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search administrators..."
          placeholderTextColor={COLORS.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: "#EEF2FF" }]}>
          <Text style={[styles.statNumber, { color: "#4F46E5" }]}>
            {admins.length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#FEF3C7" }]}>
          <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
            {pendingAdmins.length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#FEE2E2" }]}>
          <Text style={[styles.statNumber, { color: "#EF4444" }]}>
            {admins.filter((a) => a.status === "banned").length}
          </Text>
          <Text style={styles.statLabel}>Banned</Text>
        </View>
      </View>

      {/* Pending Approvals Section */}
      {filteredPending.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pending Approvals ({filteredPending.length})
          </Text>
          {filteredPending.map((admin) => (
            <View key={admin.id} style={styles.adminCard}>
              <View style={styles.adminHeader}>
                <View style={styles.adminInfo}>
                  <Text style={styles.adminName}>{admin.name}</Text>
                  <Text style={styles.adminEmail}>{admin.email}</Text>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor: getRoleBadgeColor(admin.role) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          { color: getRoleBadgeColor(admin.role) },
                        ]}
                      >
                        {admin.role === "super"
                          ? "Super Admin"
                          : admin.role === "admin"
                            ? "Admin"
                            : "Agent"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getStatusBadgeColor(admin.status) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusBadgeColor(admin.status) },
                        ]}
                      >
                        {admin.status.charAt(0).toUpperCase() +
                          admin.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(admin.id, admin.name)}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(admin.id, admin.name)}
                >
                  <Ionicons name="close" size={16} color="#7F1D1D" />
                  <Text style={[styles.actionBtnText, { color: "#7F1D1D" }]}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Active Admins Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Active Administrators ({filteredAdmins.length})
        </Text>
        {filteredAdmins.length === 0 ? (
          <Text style={styles.emptyText}>No administrators found.</Text>
        ) : (
          filteredAdmins.map((admin) => (
            <View key={admin.id} style={styles.adminCard}>
              <View style={styles.adminHeader}>
                <View style={styles.adminInfo}>
                  <Text style={styles.adminName}>{admin.name}</Text>
                  <Text style={styles.adminEmail}>{admin.email}</Text>
                  <View style={styles.badgeRow}>
                    <TouchableOpacity
                      onPress={() =>
                        handleRoleChange(admin.id, admin.name, admin.role)
                      }
                      style={[
                        styles.roleBadge,
                        {
                          backgroundColor: getRoleBadgeColor(admin.role) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          { color: getRoleBadgeColor(admin.role) },
                        ]}
                      >
                        {admin.role === "super"
                          ? "Super Admin"
                          : admin.role === "admin"
                            ? "Admin"
                            : "Agent"}
                      </Text>
                      <Ionicons
                        name="create-outline"
                        size={12}
                        color={getRoleBadgeColor(admin.role)}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getStatusBadgeColor(admin.status) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusBadgeColor(admin.status) },
                        ]}
                      >
                        {admin.status.charAt(0).toUpperCase() +
                          admin.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Privileges Display */}
              <View style={styles.privilegesContainer}>
                <Text style={styles.privilegesLabel}>Privileges:</Text>
                <View style={styles.privilegesRow}>
                  {admin.privileges.canChat && (
                    <View style={styles.privilegeTag}>
                      <Ionicons
                        name="chatbubbles"
                        size={12}
                        color={COLORS.teal[600]}
                      />
                      <Text style={styles.privilegeTagText}>Chat</Text>
                    </View>
                  )}
                  {admin.privileges.canCreateContent && (
                    <View style={styles.privilegeTag}>
                      <Ionicons
                        name="create"
                        size={12}
                        color={COLORS.coral[600]}
                      />
                      <Text style={styles.privilegeTagText}>Content</Text>
                    </View>
                  )}
                  {admin.privileges.canManageUsers && (
                    <View style={styles.privilegeTag}>
                      <Ionicons name="people" size={12} color={COLORS.info} />
                      <Text style={styles.privilegeTagText}>Users</Text>
                    </View>
                  )}
                  {admin.privileges.canManageAdmins && (
                    <View style={styles.privilegeTag}>
                      <Ionicons
                        name="shield"
                        size={12}
                        color={COLORS.coral[600]}
                      />
                      <Text style={styles.privilegeTagText}>Admins</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => openPrivilegeEditor(admin)}
                >
                  <Ionicons name="settings" size={16} color="#4F46E5" />
                  <Text style={[styles.actionBtnText, { color: "#4F46E5" }]}>
                    Privileges
                  </Text>
                </TouchableOpacity>

                {admin.status === "banned" ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.unbanBtn]}
                    onPress={() => handleUnban(admin.id, admin.name)}
                  >
                    <Ionicons name="refresh" size={16} color="#059669" />
                    <Text style={[styles.actionBtnText, { color: "#059669" }]}>
                      Unban
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.banBtn]}
                    onPress={() => handleBan(admin.id, admin.name)}
                    disabled={admin.id === currentAdmin.id}
                  >
                    <Ionicons
                      name="ban"
                      size={16}
                      color={
                        admin.id === currentAdmin.id ? "#9CA3AF" : "#DC2626"
                      }
                    />
                    <Text
                      style={[
                        styles.actionBtnText,
                        {
                          color:
                            admin.id === currentAdmin.id
                              ? "#9CA3AF"
                              : "#DC2626",
                        },
                      ]}
                    >
                      Ban
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionBtn, styles.removeBtn]}
                  onPress={() => handleRemove(admin.id, admin.name)}
                  disabled={admin.id === currentAdmin.id}
                >
                  <Ionicons
                    name="trash"
                    size={16}
                    color={admin.id === currentAdmin.id ? "#9CA3AF" : "#7F1D1D"}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      {
                        color:
                          admin.id === currentAdmin.id ? "#9CA3AF" : "#7F1D1D",
                      },
                    ]}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Privilege Editor Modal */}
      <Modal
        visible={showPrivilegeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivilegeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Privileges</Text>
              <TouchableOpacity onPress={() => setShowPrivilegeModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedAdmin && (
              <>
                <Text style={styles.modalSubtitle}>{selectedAdmin.name}</Text>

                <View style={styles.privilegeList}>
                  <TouchableOpacity
                    style={styles.privilegeItem}
                    onPress={() => togglePrivilege("canChat")}
                  >
                    <View style={styles.privilegeItemLeft}>
                      <Ionicons
                        name="chatbubbles"
                        size={20}
                        color={COLORS.teal[600]}
                      />
                      <View style={styles.privilegeItemText}>
                        <Text style={styles.privilegeItemTitle}>
                          Chat Access
                        </Text>
                        <Text style={styles.privilegeItemDesc}>
                          Can respond to support chats
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        selectedAdmin.privileges.canChat
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={
                        selectedAdmin.privileges.canChat
                          ? COLORS.teal[600]
                          : COLORS.gray[400]
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.privilegeItem}
                    onPress={() => togglePrivilege("canCreateContent")}
                  >
                    <View style={styles.privilegeItemLeft}>
                      <Ionicons
                        name="create"
                        size={20}
                        color={COLORS.coral[600]}
                      />
                      <View style={styles.privilegeItemText}>
                        <Text style={styles.privilegeItemTitle}>
                          Content Creation
                        </Text>
                        <Text style={styles.privilegeItemDesc}>
                          Can add videos, topics, and FAQs
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        selectedAdmin.privileges.canCreateContent
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={
                        selectedAdmin.privileges.canCreateContent
                          ? COLORS.teal[600]
                          : COLORS.gray[400]
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.privilegeItem}
                    onPress={() => togglePrivilege("canManageUsers")}
                  >
                    <View style={styles.privilegeItemLeft}>
                      <Ionicons name="people" size={20} color={COLORS.info} />
                      <View style={styles.privilegeItemText}>
                        <Text style={styles.privilegeItemTitle}>
                          User Management
                        </Text>
                        <Text style={styles.privilegeItemDesc}>
                          Can manage regular users
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        selectedAdmin.privileges.canManageUsers
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={
                        selectedAdmin.privileges.canManageUsers
                          ? COLORS.teal[600]
                          : COLORS.gray[400]
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.privilegeItem}
                    onPress={() => togglePrivilege("canManageAdmins")}
                  >
                    <View style={styles.privilegeItemLeft}>
                      <Ionicons
                        name="shield"
                        size={20}
                        color={COLORS.coral[600]}
                      />
                      <View style={styles.privilegeItemText}>
                        <Text style={styles.privilegeItemTitle}>
                          Admin Management
                        </Text>
                        <Text style={styles.privilegeItemDesc}>
                          Can manage other admins
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        selectedAdmin.privileges.canManageAdmins
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={
                        selectedAdmin.privileges.canManageAdmins
                          ? COLORS.teal[600]
                          : COLORS.gray[400]
                      }
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={() => setShowPrivilegeModal(false)}
                >
                  <Text style={styles.closeModalBtnText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.signOutBtn} onPress={signOutAdmin}>
          <Ionicons name="log-out" size={20} color={COLORS.coral[700]} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.coral[600],
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    paddingRight: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
  },
  subtitle: {
    color: "#FECACA",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  adminCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  adminEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  privilegesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  privilegesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  privilegesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  privilegeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  privilegeTagText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  approveBtn: {
    backgroundColor: "#10B981",
  },
  rejectBtn: {
    backgroundColor: "#FEE2E2",
  },
  editBtn: {
    backgroundColor: "#EEF2FF",
  },
  banBtn: {
    backgroundColor: "#FEE2E2",
  },
  unbanBtn: {
    backgroundColor: "#D1FAE5",
  },
  removeBtn: {
    backgroundColor: "#FECACA",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    paddingVertical: 24,
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: COLORS.coral[700],
    fontWeight: "700",
    fontSize: 16,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: COLORS.background,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 24,
  },
  unauthorizedText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: COLORS.coral[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  privilegeList: {
    gap: 12,
  },
  privilegeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  privilegeItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  privilegeItemText: {
    marginLeft: 12,
  },
  privilegeItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  privilegeItemDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: COLORS.coral[600],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  closeModalBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SuperAdminManagementScreen;
