import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 40,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minHeight: 100,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  settingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
  versionBox: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
  versionSubtext: {
    fontSize: 12,
    color: "#bbb",
    marginTop: 4,
  },
});
