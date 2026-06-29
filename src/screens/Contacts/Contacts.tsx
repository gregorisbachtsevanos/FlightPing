import { useAppStore } from "@/store/useAppStore";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./Contacts.styles";

const Contacts = () => {
  const { contacts, addContact, removeContact } = useAppStore();
  const [newPhone, setNewPhone] = useState("");

  const handleAdd = () => {
    const trimmed = newPhone.trim();
    if (!trimmed) {
      Alert.alert("Invalid Input", "Please enter a phone number");
      return;
    }
    addContact(trimmed);
    setNewPhone("");
  };

  const handleRemove = (phone: string) => {
    Alert.alert("Remove Contact", `Remove ${phone} from trusted contacts?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeContact(phone),
      },
    ]);
  };

  const renderContact = ({ item }: { item: string }) => (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <Text style={styles.contactIconText}>📱</Text>
      </View>
      <Text style={styles.contactText}>{item}</Text>
      <TouchableOpacity onPress={() => handleRemove(item)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Trusted Contacts</Text>
      <Text style={styles.subtitle}>
        These contacts will receive a message when you land
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#999"
          value={newPhone}
          onChangeText={setNewPhone}
          keyboardType="phone-pad"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts added yet</Text>
          <Text style={styles.emptySubtext}>
            Add phone numbers above to notify when you land
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Contacts;
