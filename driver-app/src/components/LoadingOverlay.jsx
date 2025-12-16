import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { ThemedText } from "./ThemedText";

export default function LoadingOverlay({ visible, message = "Carregando..." }) {
  const { isDark, colors } = useThemeStyles();

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.7)"
              : "rgba(0, 0, 0, 0.4)",
          },
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? colors.card : "white" },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={isDark ? colors.primary : "#3B82F6"}
            style={styles.spinner}
          />
          <ThemedText variant="primary" style={styles.text}>
            {message}
          </ThemedText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    minWidth: 160,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 14,
  },
});
