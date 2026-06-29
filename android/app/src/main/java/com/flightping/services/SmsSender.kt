package com.flightping.services

import android.content.Context
import android.telephony.SmsManager
import android.util.Log

object SmsSender {

    private const val TAG = "SmsSender"

    /**
     * Send SMS to all contacts in the list.
     * Returns false if contacts list is empty.
     * Callback is invoked per-recipient with success/failure info.
     */
    fun sendSms(
        context: Context,
        contacts: List<String>,
        message: String,
        callback: (Boolean, String?) -> Unit
    ): Boolean {

        if (contacts.isEmpty()) {
            Log.w(TAG, "No contacts to send SMS to")
            callback(false, "No contacts configured")
            return false
        }

        val smsManager = context.getSystemService(Context.SMS_SERVICE) as SmsManager
        var allSuccess = true

        for (phoneNumber in contacts) {
            try {
                val cleanNumber = phoneNumber.replace(Regex("[^0-9+]"), "")
                if (cleanNumber.isEmpty()) {
                    Log.w(TAG, "Skipping invalid phone number: $phoneNumber")
                    callback(false, "Invalid phone number: $phoneNumber")
                    allSuccess = false
                    continue
                }

                smsManager.sendTextMessage(cleanNumber, null, message, null, null)
                Log.i(TAG, "SMS sent to $cleanNumber")
                callback(true, null)

            } catch (e: Exception) {
                Log.e(TAG, "Failed to send SMS to $phoneNumber", e)
                callback(false, e.message ?: "Unknown SMS error")
                allSuccess = false
            }
        }

        return allSuccess
    }
}
