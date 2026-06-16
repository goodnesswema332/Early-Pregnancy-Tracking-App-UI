import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS } from "../constants/colors";
import * as Location from "expo-location";
import { useAdmin } from "../context/AdminContext";

// default services now come from AdminContext; kept static sample removed

const helplines = [
  {
    id: "1",
    name: "National Adolescent Helpline",
    number: "1190",
    description: "Free 24/7 support for young people",
  },
  {
    id: "2",
    name: "Gender Violence Helpline",
    number: "1195",
    description: "Report abuse or get help",
  },
  {
    id: "3",
    name: "ChildLine Kenya",
    number: "116",
    description: "Support for children and teens",
  },
];

const HealthServicesScreen = () => {
  const navigation = useNavigation<any>();
  const { services: svcList, findNearestServices } = useAdmin();
  const [nearby, setNearby] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const insets = useSafeAreaInsets();

  const dial = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const showLocationRationale = () =>
    new Promise<boolean>((resolve) => {
      Alert.alert(
        "Allow location access",
        "We use your location to show nearby youth-friendly services and directions. Do you want to allow location access?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { text: "Allow", onPress: () => resolve(true) },
        ],
        { cancelable: true },
      );
    });

  const handleUseLocation = async () => {
    setLoading(true);
    try {
      const ok = await showLocationRationale();
      if (!ok) {
        setLoading(false);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to find nearby services.",
        );
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserLocation({ latitude: lat, longitude: lng });
      const found = findNearestServices(lat, lng, 10);
      setNearby(found);
    } catch (_err) {
      // fallback
    }
    setLoading(false);
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
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Health Services</Text>
            <Text style={styles.subtitle}>
              Find youth-friendly support near you
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="heart"
            size={22}
            color={COLORS.teal[700]}
            style={styles.infoIcon}
          />
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>Youth-Friendly Services</Text>
            <Text style={styles.infoText}>
              These facilities provide confidential, non-judgmental healthcare
              for young people. You can visit them for reproductive health
              information, counseling, and support.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleUseLocation}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="navigate" size={18} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Use My Location</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Nearby Facilities</Text>
        {userLocation && (
          <View
            style={{
              height: 220,
              marginHorizontal: 20,
              marginBottom: 12,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="You"
              />
              {(nearby ?? svcList).map((s: any) =>
                s.lat && s.lng ? (
                  <Marker
                    key={s.id}
                    coordinate={{ latitude: s.lat, longitude: s.lng }}
                    title={s.name}
                    description={s.type}
                  />
                ) : null,
              )}
            </MapView>
          </View>
        )}

        {(nearby ?? svcList).map((service: any) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceType}>{service.type}</Text>
              </View>
              <View style={styles.serviceDistance}>
                <Text style={styles.serviceDistanceText}>
                  {service.distanceKm
                    ? `${service.distanceKm} km`
                    : (service.distance ?? "—")}
                </Text>
              </View>
            </View>
            <View style={styles.serviceRow}>
              <Ionicons
                name="location"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.serviceText}>{service.address}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Ionicons name="call" size={16} color={COLORS.textSecondary} />
              <Text style={styles.linkText} onPress={() => dial(service.phone)}>
                {service.phone}
              </Text>
            </View>
            <View style={styles.serviceRow}>
              <Ionicons name="time" size={16} color={COLORS.textSecondary} />
              <Text style={styles.serviceText}>{service.hours}</Text>
            </View>
            <Text style={styles.serviceSubheading}>Services offered:</Text>
            <View style={styles.tagsRow}>
              {(service.services || []).map((item: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  if (service.lat && service.lng) {
                    const label = encodeURIComponent(
                      service.name || service.address || "Destination",
                    );
                    const url =
                      Platform.OS === "ios"
                        ? `http://maps.apple.com/?daddr=${service.lat},${service.lng}&q=${label}`
                        : `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}&travelmode=driving`;
                    Linking.openURL(url);
                  } else {
                    Alert.alert(
                      "No coordinates",
                      "This service does not have coordinates for directions.",
                    );
                  }
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.teal[700]}
                />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => dial(service.phone)}
              >
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={COLORS.teal[700]}
                />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Emergency Helplines</Text>
        {helplines.map((helpline) => (
          <View key={helpline.id} style={styles.helplineCard}>
            <View style={styles.helplineInfo}>
              <Text style={styles.helplineName}>{helpline.name}</Text>
              <Text style={styles.helplineDescription}>
                {helpline.description}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.helplineButton}
              onPress={() => dial(helpline.number)}
            >
              <Text style={styles.helplineButtonText}>{helpline.number}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            All services listed are youth-friendly and respect your privacy. You
            have the right to confidential healthcare. Don't hesitate to seek
            help when you need it.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  contentContainer: { paddingBottom: 32 },
  header: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: { paddingRight: 40 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: "#D8B4FE" },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    marginTop: -24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  infoIcon: { marginRight: 12 },
  infoTextWrapper: { flex: 1 },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    marginHorizontal: 20,
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceType: { fontSize: 12, color: COLORS.textSecondary },
  serviceDistance: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  serviceDistanceText: { color: "#7C3AED", fontSize: 12, fontWeight: "700" },
  serviceRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  serviceText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  linkText: {
    marginLeft: 8,
    color: "#7C3AED",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  serviceSubheading: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 8,
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  tag: {
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 11, color: "#6D28D9" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8F8FF",
    flex: 1,
    marginRight: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "700",
  },
  helplineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  helplineInfo: { flex: 1, marginRight: 12 },
  helplineName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  helplineDescription: { fontSize: 12, color: COLORS.textSecondary },
  helplineButton: {
    backgroundColor: "#FECDD3",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  helplineButtonText: {
    color: COLORS.coral[700],
    fontSize: 13,
    fontWeight: "700",
  },
  disclaimerCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 32,
  },
  disclaimerText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default HealthServicesScreen;
