package com.flightping.utils

import android.content.Context
import android.content.SharedPreferences

object Prefs {

    private const val PREFS_NAME = "flight_ping_prefs"
    private const val KEY_TRACKING_ACTIVE = "tracking_active"
    private const val KEY_CONTACTS = "contacts"
    private const val KEY_MESSAGE = "message"
    private const val KEY_AUTO_SEND = "auto_send"

    private fun getPrefs(context: Context): SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun isTrackingActive(context: Context): Boolean =
        getPrefs(context).getBoolean(KEY_TRACKING_ACTIVE, false)

    fun setTrackingActive(context: Context, active: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_TRACKING_ACTIVE, active).apply()
    }

    fun getContacts(context: Context): List<String> {
        val json = getPrefs(context).getString(KEY_CONTACTS, "[]") ?: "[]"
        return try {
            val list = org.json.JSONArray(json)
            val result = ArrayList<String>()
            for (i in 0 until list.length()) {
                result.add(list.getString(i))
            }
            result
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun setContacts(context: Context, contacts: List<String>) {
        val json = org.json.JSONArray().apply {
            for (c in contacts) put(c)
        }.toString()
        getPrefs(context).edit().putString(KEY_CONTACTS, json).apply()
    }

    fun getMessage(context: Context): String {
        return getPrefs(context).getString(
            KEY_MESSAGE,
            "I\u2019ve landed safely \u2708\uFE0F"
        ) ?: "I\u2019ve landed safely \u2708\uFE0F"
    }

    fun setMessage(context: Context, message: String) {
        getPrefs(context).edit().putString(KEY_MESSAGE, message).apply()
    }

    fun getAutoSend(context: Context): Boolean =
        getPrefs(context).getBoolean(KEY_AUTO_SEND, true)

    fun setAutoSend(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_AUTO_SEND, enabled).apply()
    }
}
