import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useSyncNativeState from "@/hooks/useSyncNativeState";
import { useAppStore } from "@/store/useAppStore";
import { FlightPingBridge } from "@/services/FlightPingBridge";
import { styles } from "./Home.styles";

const Home = ({ navigation }: { navigation: any }) => {
  useSyncNativeState();

  const { trackingActive, autoSend, contacts, setTrackingActive, setAutoSend } =
    useAppStore();

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const active = await FlightPingBridge.isTrackingActive();
        setTrackingActive(active);
      })();
    }, [setTrackingActive]),
  );

  const handleStartTracking = async () => {
    if (contacts.length === 0) {
      Alert.alert(
        "No Contacts",
        "Add at least one trusted contact before starting flight tracking.",
        [{ text: "OK" }],
      );
      return;
    }

    setLoading(true);
    try {
      await FlightPingBridge.startFlightTracking();
      setTrackingActive(true);
      navigation.navigate("FlightActive");
    } catch (error) {
      Alert.alert("Error", "Failed to start tracking");
    } finally {
      setLoading(false);
    }
  };

  const handleStopTracking = async () => {
    setLoading(true);
    try {
      await FlightPingBridge.stopFlightTracking();
      setTrackingActive(false);
    } catch (error) {
      Alert.alert("Error", "Failed to stop tracking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flight Ping</Text>
      <Text style={styles.subtitle}>
        Automatically notify trusted contacts when you land
      </Text>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: trackingActive ? "#4CAF50" : "#9E9E9E" },
            ]}
          />
          <Text style={styles.statusText}>
            {trackingActive ? "Tracking Active" : "Tracking Inactive"}
          </Text>
        </View>

        <Text style={styles.contactsCount}>
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} configured
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, trackingActive && styles.buttonDisabled]}
        onPress={handleStartTracking}
        disabled={trackingActive || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Start Flight Mode</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.stopButton,
          !trackingActive && styles.buttonDisabled,
        ]}
        onPress={handleStopTracking}
        disabled={!trackingActive || loading}
      >
        <Text style={styles.buttonText}>Stop Tracking</Text>
      </TouchableOpacity>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Auto-send SMS on landing</Text>
        <Switch
          value={autoSend}
          onValueChange={setAutoSend}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={autoSend ? "#4CAF50" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Contacts")}
      >
        <Text style={styles.linkText}>Manage Contacts →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.linkText}>Settings →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
