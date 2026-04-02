// components/FloatingWhatsApp.tsx
import { Linking, Pressable, Text } from "react-native";

export default function FloatingWhatsApp() {
  return (
    <Pressable
      onPress={() => Linking.openURL("https://wa.me/919438240303")}
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#25D366",
        padding: 16,
        borderRadius: 50,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>WA</Text>
    </Pressable>
  );
}
