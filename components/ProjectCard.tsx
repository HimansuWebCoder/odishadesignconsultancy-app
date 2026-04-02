// components/ProjectCard.tsx
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

export default function ProjectCard({ project }: any) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/projects/${project.id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <Image source={{ uri: project.image }} style={styles.image} />
      <Text style={styles.title}>{project.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    padding: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
});
