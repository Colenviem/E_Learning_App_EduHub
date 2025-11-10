import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const ContentSettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [topics, setTopics] = useState([
    { id: 1, name: "Lập trình web", active: true },
    { id: 2, name: "Trí tuệ nhân tạo", active: false },
    { id: 3, name: "Phát triển di động", active: true },
    { id: 4, name: "Khoa học dữ liệu", active: false },
    { id: 5, name: "An ninh mạng", active: true },
  ]);

  const toggleTopic = (id: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Cài đặt nội dung",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: '#A78BFA' },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Hiển thị nội dung</Text>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Chế độ tối</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Hiển thị gợi ý học tập</Text>
          <Switch
            value={showRecommendations}
            onValueChange={setShowRecommendations}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.label}>Chỉ hiển thị chủ đề yêu thích</Text>
          <Switch
            value={showOnlyFavorites}
            onValueChange={setShowOnlyFavorites}
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
          Chủ đề yêu thích
        </Text>

        <View style={styles.topicsContainer}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicTag,
                topic.active && styles.topicTagActive,
              ]}
              onPress={() => toggleTopic(topic.id)}
            >
              <Text
                style={[
                  styles.topicText,
                  topic.active && styles.topicTextActive,
                ]}
              >
                {topic.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Tóm tắt</Text>
          <Text style={styles.summaryText}>
            Giao diện: {isDarkMode ? "Tối" : "Sáng"} {"\n"}
            Gợi ý học tập: {showRecommendations ? "Bật" : "Tắt"} {"\n"}
            Hiển thị yêu thích: {showOnlyFavorites ? "Bật" : "Tắt"} {"\n"}
            Chủ đề đang theo dõi:{" "}
            {topics.filter((t) => t.active).map((t) => t.name).join(", ")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, color: "#333" },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  topicTag: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
    backgroundColor: "#FFF",
  },
  topicTagActive: {
    backgroundColor: "#5E72E4",
    borderColor: "#5E72E4",
  },
  topicText: { fontSize: 14, color: "#333" },
  topicTextActive: { color: "#FFF", fontWeight: "600" },
  summaryBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: { fontWeight: "700", fontSize: 16, color: "#333", marginBottom: 8 },
  summaryText: { fontSize: 14, color: "#555", lineHeight: 20 },
});

export default ContentSettingsScreen;
