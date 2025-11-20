import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from '../../../_layout';

const NotificationsScreen = () => {
  const { isDarkMode } = useTheme(); 
  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
    accent: '#A78BFA',
    text: isDarkMode ? '#FFF' : '#333',
    sub: isDarkMode ? '#CCC' : '#666',
  };

  const [pushNotif, setPushNotif] = useState(true);
  const [reminders, setReminders] = useState(true);

  const registerForPushNotifications = async () => {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Thông báo', 'Bạn cần cho phép thông báo để nhận thông tin.');
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const togglePushNotif = async (value: boolean) => {
    setPushNotif(value);
    if (value) {
      const granted = await registerForPushNotifications();
      if (granted) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Thông báo thử", body: "Bạn đã bật thông báo thành công!" },
          trigger: { type: 'timeInterval', seconds: 1, repeats: false } as Notifications.TimeIntervalTriggerInput,
        });
      }
    } else {
      Alert.alert("Thông báo", "Bạn đã tắt thông báo.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Cài đặt thông báo",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.accent },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.desc, { color: colors.sub }]}>
          Quản lý các loại thông báo và nhắc nhở để bạn không bỏ lỡ thông tin quan trọng.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.label, { color: colors.text }]}>Thông báo đẩy (Push Notification)</Text>
          <Switch
            value={pushNotif}
            onValueChange={togglePushNotif}
            thumbColor={pushNotif ? colors.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: colors.accent + "50" }}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.label, { color: colors.text }]}>Nhắc nhở học tập hàng ngày</Text>
          <Switch
            value={reminders}
            onValueChange={setReminders}
            thumbColor={reminders ? colors.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: colors.accent + "50" }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scroll: { paddingBottom: 40 },
  desc: { fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 20 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 16 },
});

export default NotificationsScreen;
