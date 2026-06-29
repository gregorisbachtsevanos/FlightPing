package com.flightping.modules

import android.content.Context
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.flightping.services.FlightTrackingService
import com.flightping.utils.Prefs

class FlightPingModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FlightPing"

    // Start the foreground tracking service
    @ReactMethod
    fun startFlightTracking() {
        val ctx = reactApplicationContext
        Prefs.setTrackingActive(ctx, true)
        ctx.startService(
            android.content.Intent(ctx, FlightTrackingService::class.java)
        )
        sendEvent(ctx, "onTrackingStarted", Arguments.createMap())
    }

    // Stop the foreground tracking service
    @ReactMethod
    fun stopFlightTracking() {
        val ctx = reactApplicationContext
        Prefs.setTrackingActive(ctx, false)
        ctx.stopService(
            android.content.Intent(ctx, FlightTrackingService::class.java)
        )
        sendEvent(ctx, "onTrackingStopped", Arguments.createMap())
    }

    // Check if tracking is currently active
    @ReactMethod
    fun isTrackingActive(promise: Promise) {
        try {
            val active = Prefs.isTrackingActive(reactApplicationContext)
            promise.resolve(active)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Save trusted contacts list to shared prefs
    @ReactMethod
    fun setContacts(contacts: ReadableArray, promise: Promise) {
        try {
            val list = ArrayList<String>()
            for (i in 0 until contacts.size()) {
                list.add(contacts.getString(i))
            }
            Prefs.setContacts(reactApplicationContext, list)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Get saved trusted contacts list
    @ReactMethod
    fun getContacts(promise: Promise) {
        try {
            val contacts = Prefs.getContacts(reactApplicationContext)
            val array = Arguments.createArray()
            for (c in contacts) {
                array.pushString(c)
            }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Send SMS manually via native module
    @ReactMethod
    fun sendSmsManually(promise: Promise) {
        try {
            val ctx = reactApplicationContext
            val contacts = Prefs.getContacts(ctx)
            val message = Prefs.getMessage(ctx)
            val result = com.flightping.services.SmsSender.sendSms(ctx, contacts, message) { success, error ->
                if (success) {
                    sendEvent(ctx, "onSmsSent", Arguments.createMap())
                    promise.resolve(true)
                } else {
                    val params = Arguments.createMap()
                    params.putString("error", error)
                    sendEvent(ctx, "onSmsFailed", params)
                    promise.reject("SMS_ERROR", error)
                }
            }
            if (!result) {
                promise.reject("NO_CONTACTS", "No contacts configured")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Set the default SMS message template
    @ReactMethod
    fun setMessage(message: String, promise: Promise) {
        try {
            Prefs.setMessage(reactApplicationContext, message)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Get the current SMS message template
    @ReactMethod
    fun getMessage(promise: Promise) {
        try {
            val message = Prefs.getMessage(reactApplicationContext)
            promise.resolve(message)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Set auto-send SMS toggle
    @ReactMethod
    fun setAutoSend(enabled: Boolean, promise: Promise) {
        try {
            Prefs.setAutoSend(reactApplicationContext, enabled)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Get auto-send SMS toggle state
    @ReactMethod
    fun getAutoSend(promise: Promise) {
        try {
            val enabled = Prefs.getAutoSend(reactApplicationContext)
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // Emit event to React Native
    private fun sendEvent(ctx: ReactContext, eventName: String, params: WritableMap?) {
        ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
