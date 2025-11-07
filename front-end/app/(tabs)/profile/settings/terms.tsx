import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Điều khoản & Bảo mật' }} />
      <Text style={styles.text}>Điều khoản dịch vụ và chính sách bảo mật của ứng dụng EduHub...</Text>
      {/* Thêm nội dung dài */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 14, lineHeight: 20 },
});

export default TermsScreen;
