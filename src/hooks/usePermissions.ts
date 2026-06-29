import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { FlightPingBridge } from "../services/FlightPingBridge";

const usePermissions = () => {
  const { contacts, message, autoSend } = useAppStore();

  useEffect(() => {
    FlightPingBridge.setContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    FlightPingBridge.setMessage(message);
  }, [message]);

  useEffect(() => {
    FlightPingBridge.setAutoSend(autoSend);
  }, [autoSend]);
};

export default usePermissions;
