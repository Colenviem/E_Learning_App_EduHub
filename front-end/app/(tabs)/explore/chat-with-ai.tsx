import { API_BASE_URL } from '@/src/api';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Khai báo kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const API = `${API_BASE_URL}/api/ask-gemini`;

export default function ChatWithAI() {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<Message> | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Xin chào! Tôi là bạn AI của bạn 😊. Bạn muốn nói về điều gì hôm nay?',
    },
  ]);
  const [message, setMessage] = useState('');

  // Ẩn thanh tab khi vào màn hình chat và hiện lại khi thoát
  useLayoutEffect(() => {
    // Ẩn thanh tab
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

    // Hàm dọn dẹp: Hiện lại thanh tab
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
        },
      });
    };
  }, [navigation]);

  // Gửi tin nhắn và gọi API AI
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);

    const prompt = message;
    setMessage('');

    try {
      const res = await axios.post(API, { prompt });
      if (res.data.answer) {
        const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: res.data.answer };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Lỗi khi gọi API AI:', err);
      const errorMsg: Message = { id: (Date.now() + 2).toString(), sender: 'ai', text: 'Xin lỗi, không thể kết nối với AI.' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // Component render
  return (
    <KeyboardAvoidingView
      style={styles.container}
      // Dùng 'padding' cho iOS và 'height' hoặc 'padding' cho Android
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen options={{ title: 'Trò chuyện với bạn AI' }} />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'ai' ? styles.aiMsg : styles.userMsg]}>
            <Text style={[styles.msgText, item.sender === 'user' && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        // Tự động cuộn xuống tin nhắn mới nhất
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Nhập tin nhắn..."
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage} // Cho phép gửi bằng phím Enter/Done
          enablesReturnKeyAutomatically={true}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn} disabled={!message.trim()}>
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Định nghĩa Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  message: { marginVertical: 4, padding: 10, borderRadius: 10, maxWidth: '80%' },
  aiMsg: { alignSelf: 'flex-start', backgroundColor: '#E0E0E0' },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#A78BFA' },
  msgText: { color: '#000' },
  // Đã SỬA LỖI ở đây: loại bỏ marginBottom: 90
  inputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', alignItems: 'center' }, 
  input: { flex: 1, padding: 10, backgroundColor: '#eee', borderRadius: 20, marginRight: 8 },
  sendBtn: { backgroundColor: '#A78BFA', borderRadius: 20, padding: 10 },
});