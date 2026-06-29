import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { FlightPingBridge, TrackingEvent } from "../services/FlightPingBridge";

const useSyncNativeState = () => {
  const {
    contacts,
    message,
    autoSend,
    trackingActive,
    setContacts,
    setMessage,
    setAutoSend,
    setTrackingActive,
    setSmsSent,
    setSmsError,
    setLastSmsTimestamp,
  } = useAppStore();

  useEffect(() => {
    (async () => {
      try {
        const [nativeContacts, nativeMessage, nativeAutoSend, nativeTracking] =
          await Promise.all([
            FlightPingBridge.getContacts(),
            FlightPingBridge.getMessage(),
            FlightPingBridge.getAutoSend(),
            FlightPingBridge.isTrackingActive(),
          ]);
        setContacts(nativeContacts);
        setMessage(nativeMessage);
        setAutoSend(nativeAutoSend);
        setTrackingActive(nativeTracking);
      } catch {
        // Native bridge may not be ready on first load
      }
    })();
  }, [setContacts, setMessage, setAutoSend, setTrackingActive]);

  useEffect(() => {
    FlightPingBridge.setContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    FlightPingBridge.setMessage(message);
  }, [message]);

  useEffect(() => {
    FlightPingBridge.setAutoSend(autoSend);
  }, [autoSend]);

  useEffect(() => {
    const unsubscribe = FlightPingBridge.subscribeTrackingEvents(
      (event: TrackingEvent) => {
        switch (event.type) {
          case "onTrackingStarted":
            setTrackingActive(true);
            break;
          case "onTrackingStopped":
            setTrackingActive(false);
            break;
          case "onSmsSent":
            setSmsSent(true);
            setSmsError(null);
            setLastSmsTimestamp(Date.now());
            break;
          case "onSmsFailed":
            setSmsSent(false);
            setSmsError(
              (event.payload as Record<string, unknown>)?.error as string,
            );
            break;
        }
      },
    );
    return unsubscribe;
  }, [setTrackingActive, setSmsSent, setSmsError, setLastSmsTimestamp]);
};

export default useSyncNativeState;
