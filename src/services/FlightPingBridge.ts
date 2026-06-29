import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { FlightPing } = NativeModules;
const flightPingEmitter = new NativeEventEmitter(FlightPing);

export type SmsResult = {
  success: boolean;
  error?: string;
};

export type TrackingEvent = {
  type: 'onTrackingStarted' | 'onTrackingStopped' | 'onSmsSent' | 'onSmsFailed';
  payload?: Record<string, unknown>;
};

export const FlightPingBridge = {
  async startFlightTracking(): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Flight tracking is only available on Android');
    }
    await FlightPing.startFlightTracking();
  },

  async stopFlightTracking(): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Flight tracking is only available on Android');
    }
    await FlightPing.stopFlightTracking();
  },

  async isTrackingActive(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }
    return await FlightPing.isTrackingActive();
  },

  async setContacts(contacts: string[]): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Contacts management is only available on Android');
    }
    await FlightPing.setContacts(contacts);
  },

  async getContacts(): Promise<string[]> {
    if (Platform.OS !== 'android') {
      return [];
    }
    return await FlightPing.getContacts();
  },

  async sendSmsManually(): Promise<SmsResult> {
    if (Platform.OS !== 'android') {
      throw new Error('SMS sending is only available on Android');
    }
    try {
      await FlightPing.sendSmsManually();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMS error',
      };
    }
  },

  async setMessage(message: string): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Message configuration is only available on Android');
    }
    await FlightPing.setMessage(message);
  },

  async getMessage(): Promise<string> {
    if (Platform.OS !== 'android') {
      return "I've landed safely ✈️";
    }
    return await FlightPing.getMessage();
  },

  async setAutoSend(enabled: boolean): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Auto-send is only available on Android');
    }
    await FlightPing.setAutoSend(enabled);
  },

  async getAutoSend(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }
    return await FlightPing.getAutoSend();
  },

  subscribeTrackingEvents(
    handler: (event: TrackingEvent) => void
  ): () => void {
    const subscriptions = [
      flightPingEmitter.addListener('onTrackingStarted', (payload) =>
        handler({ type: 'onTrackingStarted', payload })
      ),
      flightPingEmitter.addListener('onTrackingStopped', (payload) =>
        handler({ type: 'onTrackingStopped', payload })
      ),
      flightPingEmitter.addListener('onSmsSent', (payload) =>
        handler({ type: 'onSmsSent', payload })
      ),
      flightPingEmitter.addListener('onSmsFailed', (payload) =>
        handler({ type: 'onSmsFailed', payload })
      ),
    ];

    return () => subscriptions.forEach((sub) => sub.remove());
  },
};
