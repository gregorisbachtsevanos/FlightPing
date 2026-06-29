import { useAppStore } from "@/store/useAppStore";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { styles } from "./Settings.styles";

const Settings = () => {
  const { message, setMessage, autoSend, setAutoSend } = useAppStore();
  const [editMessage, setEditMessage] = useState(message);

  const handleSaveMessage = () => {
    if (!editMessage.trim()) {
      Alert.alert("Invalid Message", "Message cannot be empty");
      return;
    }
    setMessage(editMessage.trim());
    Alert.alert("Saved", "Message template updated");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionTitle}>SMS Message</Text>
      <TextInput
        style={styles.messageInput}
        value={editMessage}
        onChangeText={setEditMessage}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMessage}>
        <Text style={styles.saveButtonText}>Save Message</Text>
      </TouchableOpacity>

      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-send SMS on landing</Text>
          <Switch
            value={autoSend}
            onValueChange={setAutoSend}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={autoSend ? "#4CAF50" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.settingDescription}>
          When enabled, SMS will be sent automatically when airplane mode is
          turned off
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. Start Flight Mode before takeoff
          {"\n"}2. Turn on airplane mode during flight
          {"\n"}3. When you land and turn off airplane mode, trusted contacts
          will receive your message
        </Text>
      </View>

      <View style={styles.versionBox}>
        <Text style={styles.versionText}>Flight Ping v1.0.0</Text>
        <Text style={styles.versionSubtext}>Android Only</Text>
      </View>
    </ScrollView>
  );
};

export default Settings;
