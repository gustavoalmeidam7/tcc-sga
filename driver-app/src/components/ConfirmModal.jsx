import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeStyles } from "@/src/hooks/useThemeStyles";
import { ThemedText } from "./ThemedText";

export default function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}) {
  const { isDark, colors } = useThemeStyles();
  
  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return "alert-triangle";
      case "success":
        return "check-circle";
      case "info":
      default:
        return "info";
    }
  };

  const getColor = () => {
    switch (type) {
      case "danger":
        return colors.error || "#EF4444";
      case "success":
        return colors.success || "#10B981";
      case "info":
      default:
        return colors.primary || "#3B82F6";
    }
  };

  const color = getColor();
  const iconName = getIcon();

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)" }]}>
        <View style={[styles.container, { backgroundColor: isDark ? colors.card : "white" }]}>
          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${color}20` },
              ]}
            >
              <Feather name={iconName} size={28} color={color} />
            </View>
            <ThemedText variant="primary" style={styles.title}>{title}</ThemedText>
            <ThemedText variant="muted" style={styles.message}>{message}</ThemedText>
          </View>
          <View style={styles.actions}>
            {cancelText ? (
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: isDark ? colors.input : "#F3F4F6" }]}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <ThemedText variant="primary" style={styles.cancelText}>{cancelText}</ThemedText>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: color }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontWeight: "600",
    fontSize: 16,
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

