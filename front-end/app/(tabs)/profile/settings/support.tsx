import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from '../../../_layout';

const SupportScreen = () => {
  const { isDarkMode } = useTheme();
  const colors = {
    background: isDarkMode ? '#121212' : '#F7F7F7',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFF',
    accent: '#A78BFA',
    text: isDarkMode ? '#FFF' : '#333',
    sub: isDarkMode ? '#CCC' : '#666',
  };

  const handleCall = () => Linking.openURL("tel:+840123456789");
  const handleEmail = () => Linking.openURL("mailto:support@eduhub.com");

  const faqs = [
    { question: "Làm sao để thay đổi mật khẩu?", answer: "Vào Cài đặt > Tài khoản > Đổi mật khẩu." },
    { question: "Làm sao để nâng cấp lên Premium?", answer: "Vào Tài khoản > Nâng cấp Premium và chọn gói phù hợp." },
    { question: "Ứng dụng bị lỗi, tôi nên làm gì?", answer: "Thử đóng app và mở lại. Nếu lỗi vẫn còn, liên hệ bộ phận hỗ trợ." },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{
        title: "Hỗ trợ",
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: colors.accent },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "700" },
      }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.desc, { color: colors.text }]}>
          Liên hệ bộ phận hỗ trợ để được giúp đỡ về tài khoản và ứng dụng.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleCall}>
            <Feather name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Gọi ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleEmail}>
            <Feather name="mail" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Gửi email</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.faqTitle, { color: colors.text }]}>Câu hỏi thường gặp</Text>
        {faqs.map((faq, idx) => (
          <View key={idx} style={[styles.faqCard, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.question, { color: colors.text }]}>{faq.question}</Text>
            <Text style={[styles.answer, { color: colors.sub }]}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scroll: { paddingBottom: 40 },
  desc: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  buttons: { flexDirection: "row", justifyContent: "space-around", marginBottom: 30 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  faqTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  faqCard: { borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  question: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
  answer: { fontSize: 14, lineHeight: 20 },
});

export default SupportScreen;
