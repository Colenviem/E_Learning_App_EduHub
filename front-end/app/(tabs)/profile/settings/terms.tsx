import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const TermsScreen = () => {
  const sections = [
    {
      title: "1. Giới thiệu",
      content:
        "Chào mừng bạn đến với EduHub! Bằng việc sử dụng ứng dụng, bạn đồng ý tuân thủ các điều khoản dịch vụ và chính sách bảo mật này.",
    },
    {
      title: "2. Quyền và nghĩa vụ của người dùng",
      content:
        "Người dùng có quyền truy cập các khóa học, bài tập và tính năng trong ứng dụng. Người dùng có nghĩa vụ sử dụng nội dung hợp pháp và tôn trọng quyền sở hữu trí tuệ.",
    },
    {
      title: "3. Quyền sở hữu trí tuệ",
      content:
        "Tất cả nội dung, hình ảnh, văn bản, mã nguồn thuộc bản quyền của EduHub. Việc sao chép, phân phối hoặc sử dụng trái phép đều bị cấm.",
    },
    {
      title: "4. Chính sách bảo mật",
      content:
        "Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn. Mọi thông tin đăng ký, tiến trình học tập đều được lưu trữ an toàn và không chia sẻ với bên thứ ba nếu không có sự đồng ý.",
    },
    {
      title: "5. Giới hạn trách nhiệm",
      content:
        "EduHub không chịu trách nhiệm cho các sự cố phát sinh do việc sử dụng ứng dụng sai cách hoặc các vấn đề về thiết bị của người dùng.",
    },
    {
      title: "6. Thay đổi điều khoản",
      content:
        "Chúng tôi có quyền cập nhật các điều khoản và chính sách này. Người dùng nên kiểm tra định kỳ để nắm rõ các cập nhật mới nhất.",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: "Điều khoản & Bảo mật", 
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: '#A78BFA' },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "700" },
       }} />
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.content}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  section: { marginBottom: 20, padding: 10, },
  title: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 6 },
  content: { fontSize: 14, lineHeight: 20, color: "#555" },
});

export default TermsScreen;
