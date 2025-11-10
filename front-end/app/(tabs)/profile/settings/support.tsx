import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SupportScreen = () => {
  const handleCall = () => {
    Linking.openURL("tel:+840123456789");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@eduhub.com");
  };

  const faqs = [
    { question: "Làm sao để thay đổi mật khẩu?", answer: "Vào Cài đặt > Tài khoản > Đổi mật khẩu." },
    { question: "Làm sao để nâng cấp lên Premium?", answer: "Vào Tài khoản > Nâng cấp Premium và chọn gói phù hợp." },
    { question: "Ứng dụng bị lỗi, tôi nên làm gì?", answer: "Thử đóng app và mở lại. Nếu lỗi vẫn còn, liên hệ bộ phận hỗ trợ." },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: "Hỗ trợ", headerTitleAlign: "center",
        headerStyle: { backgroundColor: '#A78BFA' },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "700" },
      }} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.desc}>
          Liên hệ bộ phận hỗ trợ để được giúp đỡ về tài khoản và ứng dụng.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <Feather name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Gọi ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleEmail}>
            <Feather name="mail" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Gửi email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.faqTitle}>Câu hỏi thường gặp</Text>
        {faqs.map((faq, idx) => (
          <View key={idx} style={styles.faqCard}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", padding: 20 },
  scroll: { paddingBottom: 40 },
  desc: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 20 },
  buttons: { flexDirection: "row", justifyContent: "space-around", marginBottom: 30 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  faqTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  faqCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  question: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 6 },
  answer: { fontSize: 14, color: "#666", lineHeight: 20 },
});

export default SupportScreen;
