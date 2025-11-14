import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from '../../../_layout';

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

const ContentSettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("vi");

  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
    text: isDarkMode ? '#FFF' : '#333',
    subText: isDarkMode ? '#CCC' : '#555',
    accent: '#A78BFA',
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang) setLanguage(storedLang);
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (langCode: string) => {
    setLanguage(langCode);
    await AsyncStorage.setItem("appLanguage", langCode);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Cài đặt nội dung",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.accent },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hiển thị nội dung</Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.label, { color: colors.text }]}>Chế độ tối</Text>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            thumbColor={isDarkMode ? colors.accent : "#ccc"} 
            trackColor={{ false: "#ccc", true: colors.accent + "50" }}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Ngôn ngữ</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.languageItem, { backgroundColor: language === lang.code ? colors.accent + "20" : colors.cardBg }]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={[styles.label, { color: colors.text }]}>{lang.label}</Text>
              {language === lang.code && <Text style={{ color: colors.accent }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  label: { fontSize: 16 },
});

export default ContentSettingsScreen;
