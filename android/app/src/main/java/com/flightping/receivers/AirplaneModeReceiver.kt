package com.flightping.receivers

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Settings.Global
import android.util.Log
import com.flightping.services.SmsSender
import com.flightping.utils.Prefs

class AirplaneModeReceiver : BroadcastReceiver() {

    private val TAG = "AirplaneModeReceiver"

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_AIRPLANE_MODE_CHANGED) {
            return
        }

        // Check if airplane mode is currently OFF
        val isAirplaneModeOn = getAirplaneMode(context)

        if (isAirplaneModeOn) {
            Log.i(TAG, "Airplane mode turned ON")
            return
        }

        Log.i(TAG, "Airplane mode turned OFF — checking tracking state")

        // Only act if tracking is active
        if (!Prefs.isTrackingActive(context)) {
            Log.i(TAG, "Tracking not active, ignoring")
            return
        }

        val autoSend = Prefs.getAutoSend(context)
        val contacts = Prefs.getContacts(context)
        val message = Prefs.getMessage(context)

        if (contacts.isEmpty()) {
            Log.w(TAG, "No contacts configured, skipping SMS")
            return
        }

        if (autoSend) {
            Log.i(TAG, "Auto-send enabled, sending SMS to ${contacts.size} contacts")
            SmsSender.sendSms(context, contacts, message) { success, error ->
                if (success) {
                    Log.i(TAG, "SMS batch completed successfully")
                } else {
                    Log.e(TAG, "SMS batch had failures: $error")
                }
            }
        } else {
            Log.i(TAG, "Auto-send disabled — event emitted for React Native confirmation")
        }
    }

    private fun getAirplaneMode(context: Context): Boolean {
        return try {
            Global.getInt(context.contentResolver, Global.AIRPLANE_MODE_ON, 0) == 1
        } catch (e: Exception) {
            Log.e(TAG, "Failed to read airplane mode state", e)
            false
        }
    }
}
