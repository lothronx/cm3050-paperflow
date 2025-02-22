import { StyleSheet, View, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";
import { CustomButton } from "./CustomButton";

interface PreviewActionsProps {
  onSave: (type: "photos" | "pdf") => void;
  isLoading: boolean;
}

export const PreviewActions = ({ onSave, isLoading }: PreviewActionsProps) => {
  return (
    <View style={styles.container}>
      <CustomButton
        text="Save to Photos"
        onPress={() => onSave("photos")}
        variant="outline"
        disabled={isLoading}
      />
      <CustomButton
        text="Save PDF to Files"
        onPress={() => onSave("pdf")}
        variant="outline"
        disabled={isLoading}
      />
      <CustomButton text="Done" onPress={() => router.push("/")} disabled={isLoading} />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
