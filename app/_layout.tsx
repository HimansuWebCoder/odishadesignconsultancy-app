import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black,
} from "@expo-google-fonts/playfair-display";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/poppins";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: "home", inactive: "home-outline" },
  "projects/index": { active: "grid", inactive: "grid-outline" },
  "services/index": { active: "construct", inactive: "construct-outline" },
  book: { active: "calendar", inactive: "calendar-outline" },
  contact: { active: "person", inactive: "person-outline" },
};

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_600SemiBold,
    Inter_400Regular,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_500Medium,
    Inter_900Black,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_800ExtraBold,
    PlayfairDisplay_900Black,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={({ route }) => {
        const icons = TAB_ICONS[route.name];

        return {
          headerShown: false,

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: "#999",

          tabBarStyle: {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 6,
            backgroundColor: "#fff",
            borderTopWidth: 0,
            elevation: 10,
          },

          tabBarLabelStyle: styles.label,
          tabBarItemStyle: styles.item,

          tabBarIcon: ({ color, focused }) => {
            const iconName = icons
              ? focused
                ? icons.active
                : icons.inactive
              : "ellipse-outline";

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="projects/index" options={{ title: "Projects" }} />
      <Tabs.Screen name="services/index" options={{ title: "Services" }} />
      <Tabs.Screen name="book" options={{ title: "Book" }} />
      <Tabs.Screen name="contact" options={{ title: "Contact" }} />

      {/* Hide dynamic route */}
      <Tabs.Screen name="projects/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginTop: 2,
  },

  item: {
    justifyContent: "center",
    alignItems: "center",
  },
});
