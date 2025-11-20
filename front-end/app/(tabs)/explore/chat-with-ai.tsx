import { API_BASE_URL } from '@/src/api';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API = `${API_BASE_URL}/api/ask-gemini`;

export default function ChatWithAI() {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<any> | null>(null);

  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Xin chào! Tôi là bạn AI của bạn 😊. Bạn muốn nói về điều gì hôm nay?' },
  ]);
  const [message, setMessage] = useState('');

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
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

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);

    const prompt = message;
    setMessage('');

    try {
      const res = await axios.post(API, { prompt });
      if (res.data.answer) {
        const aiMessage = { id: (Date.now()+1).toString(), sender: 'ai', text: res.data.answer };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Lỗi khi gọi API AI:', err);
      const errorMsg = { id: (Date.now()+2).toString(), sender: 'ai', text: 'Xin lỗi, không thể kết nối với AI.' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Trò chuyện với bạn AI' }} />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'ai' ? styles.aiMsg : styles.userMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Nhập tin nhắn..."
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  message: { marginVertical: 4, padding: 10, borderRadius: 10, maxWidth: '80%' },
  aiMsg: { alignSelf: 'flex-start', backgroundColor: '#E0E0E0' },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#A78BFA' },
  msgText: { color: '#000' },
  inputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, padding: 10, backgroundColor: '#eee', borderRadius: 20, marginRight: 8 },
  sendBtn: { backgroundColor: '#A78BFA', borderRadius: 20, padding: 10 },
});