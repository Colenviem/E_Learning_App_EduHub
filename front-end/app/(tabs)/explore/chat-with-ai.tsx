// ChatWithAI.tsx
import { Feather } from '@expo/vector-icons';
import { Stack, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatWithAI() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Xin chào! Tôi là bạn AI của bạn 😊. Bạn muốn nói về điều gì hôm nay?' },
  ]);
  const [input, setInput] = useState('');

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

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now().toString(), sender: 'ai', text: 'Nghe hay đó! Hãy kể thêm cho tôi nhé 💬' }]);
    }, 600);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Trò chuyện với bạn AI' }} />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'ai' ? styles.aiMsg : styles.userMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Nhập tin nhắn..."
          style={styles.input}
          value={input}
          onChangeText={setInput}
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
