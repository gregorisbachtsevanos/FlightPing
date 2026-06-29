import Contacts from "@/screens/Contacts";
import FlightActive from "@/screens/FlightActive";
import Home from "@/screens/Home";
import Settings from "@/screens/Settings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#333",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{ tabBarLabel: "Contacts" }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#333",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FlightActive"
          component={FlightActive}
          options={{ title: "Flight Monitoring" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
