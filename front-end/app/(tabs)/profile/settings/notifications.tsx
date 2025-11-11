import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const MAU = {
  nen: "#F7F7F7",
  cardBg: "#FFFFFF",
  accent: "#A78BFA",
  text: "#333",
  sub: "#666",
};

const NotificationsScreen = () => {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [reminders, setReminders] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Cài đặt thông báo",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: MAU.accent },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.desc}>
          Quản lý các loại thông báo và nhắc nhở để bạn không bỏ lỡ thông tin quan trọng.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Thông báo đẩy (Push Notification)</Text>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            thumbColor={pushNotif ? MAU.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: MAU.accent + "50" }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Thông báo qua Email</Text>
          <Switch
            value={emailNotif}
            onValueChange={setEmailNotif}
            thumbColor={emailNotif ? MAU.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: MAU.accent + "50" }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nhắc nhở học tập hàng ngày</Text>
          <Switch
            value={reminders}
            onValueChange={setReminders}
            thumbColor={reminders ? MAU.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: MAU.accent + "50" }}
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Tóm tắt</Text>
          <Text style={styles.summaryText}>
            Push Notification: {pushNotif ? "Bật" : "Tắt"}{"\n"}
            Email Notification: {emailNotif ? "Bật" : "Tắt"}{"\n"}
            Nhắc nhở hàng ngày: {reminders ? "Bật" : "Tắt"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAU.nen, padding: 20 },
  scroll: { paddingBottom: 40 },
  desc: {
    fontSize: 15,
    color: MAU.sub,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: MAU.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, color: MAU.text },
  summary: {
    backgroundColor: MAU.cardBg,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: { fontWeight: "700", fontSize: 16, color: MAU.text, marginBottom: 8 },
  summaryText: { fontSize: 14, color: MAU.sub, lineHeight: 20 },
});

export default NotificationsScreen;
