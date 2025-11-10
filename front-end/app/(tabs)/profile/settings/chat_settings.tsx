import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MAU = {
  nen: "#F7F7F7",
  cardBg: "#FFFFFF",
  accent: "#A78BFA", 
  text: "#333",
  sub: "#666",
};

const ChatSettingsScreen = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiCreativity, setAICreativity] = useState(0.6);
  const [language, setLanguage] = useState("Tiếng Việt");

  const handleSave = () => {
    Alert.alert(
      "Đã lưu cài đặt 💾",
      `Ngôn ngữ: ${language}\nGiọng nói: ${voiceEnabled ? "Bật" : "Tắt"}\nChế độ tối: ${darkMode ? "Bật" : "Tắt"}\nĐộ sáng tạo: ${(aiCreativity * 100).toFixed(0)}%`
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Cài đặt hội thoại",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: MAU.accent },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.desc}>
          Quản lý các tùy chọn trò chuyện, giọng nói và mức sáng tạo của AI để
          tối ưu trải nghiệm của bạn.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Feather name="globe" size={22} color={MAU.accent} />
            <Text style={styles.label}>Ngôn ngữ hội thoại</Text>
          </View>
          <Text style={styles.value}>{language}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Feather name="mic" size={22} color={MAU.accent} />
            <Text style={styles.label}>Giọng nói AI</Text>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
            thumbColor={voiceEnabled ? MAU.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: MAU.accent + "50" }}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Feather name="moon" size={22} color={MAU.accent} />
            <Text style={styles.label}>Chế độ tối</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? MAU.accent : "#ccc"}
            trackColor={{ false: "#ccc", true: MAU.accent + "50" }}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Feather name="activity" size={22} color={MAU.accent} />
            <Text style={styles.label}>Độ sáng tạo của AI</Text>
          </View>
          <Slider
            style={{ width: "100%", marginTop: 10 }}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={aiCreativity}
            minimumTrackTintColor={MAU.accent}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={MAU.accent}
            onValueChange={setAICreativity}
          />
          <Text style={styles.sliderValue}>
            {(aiCreativity * 100).toFixed(0)}%
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Feather name="save" size={20} color="#FFF" />
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAU.nen,
    padding: 20,
  },
  desc: {
    fontSize: 15,
    color: MAU.sub,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: MAU.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: MAU.text,
  },
  value: {
    fontSize: 15,
    color: MAU.sub,
    marginTop: 4,
  },
  sliderValue: {
    textAlign: "right",
    color: MAU.sub,
    marginTop: 4,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: MAU.accent,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ChatSettingsScreen;
