import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAppStore } from "@/store/useAppStore";
import { FlightPingBridge } from "@/services/FlightPingBridge";
import { styles } from "./FlightActive.styles";

const FlightActive = ({ navigation }: { navigation: any }) => {
  const { contacts, message, autoSend, trackingActive, setTrackingActive } =
    useAppStore();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const active = await FlightPingBridge.isTrackingActive();
        if (!active) {
          setTrackingActive(false);
          navigation.navigate("Home");
        }
      })();
    }, [setTrackingActive, navigation]),
  );

  const handleCancel = () => {
    Alert.alert("Cancel Tracking", "Stop monitoring airplane mode?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          await FlightPingBridge.stopFlightTracking();
          setTrackingActive(false);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  const handleSendTest = async () => {
    if (contacts.length === 0) {
      Alert.alert("No Contacts", "Add contacts before sending test SMS");
      return;
    }
    Alert.alert(
      "Send Test SMS",
      `Send "${message}" to all ${contacts.length} contact(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            const result = await FlightPingBridge.sendSmsManually();
            if (result.success) {
              Alert.alert("Success", "Test SMS sent to all contacts");
            } else {
              Alert.alert("Failed", result.error || "SMS failed");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.activeBanner}>
        <Text style={styles.bannerPulse}>●</Text>
        <Text style={styles.bannerText}>Monitoring Airplane Mode</Text>
      </View>

      <Text style={styles.sectionTitle}>Trusted Contacts</Text>
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactCard}>
          <Text style={styles.contactIcon}>📱</Text>
          <Text style={styles.contactPhone}>{contact}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Message Preview</Text>
      <View style={styles.messageCard}>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Auto-send SMS</Text>
        <Text style={styles.infoValue}>
          {autoSend ? "Enabled" : "Disabled"}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.testButton} onPress={handleSendTest}>
          <Text style={styles.testButtonText}>Send Test SMS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel Tracking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FlightActive;
