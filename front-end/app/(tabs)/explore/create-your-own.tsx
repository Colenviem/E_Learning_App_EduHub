import { Stack, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateYourOwn() {
  const navigation = useNavigation();
  const [topic, setTopic] = useState('');

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: 'flex',
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
          position: 'absolute',
          bottom: 25,
          left: 10,
          right: 10,
          borderRadius: 15,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }
      });
    };
  }, [navigation]);

  const handleCreate = () => {
    if (!topic.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập chủ đề bạn muốn tạo!');
      return;
    }
    Alert.alert('Tạo thành công', `Đã tạo tình huống học tập cho chủ đề: "${topic}"`);
    setTopic('');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tạo của riêng bạn' }} />
      <Text style={styles.title}>Tạo tình huống học tập cá nhân</Text>
      <Text style={styles.subtitle}>Nhập chủ đề bạn muốn luyện tập hoặc khám phá:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Phỏng vấn xin việc, du lịch, thương lượng..."
        value={topic}
        onChangeText={setTopic}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Tạo ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A78BFA',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});