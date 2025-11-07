import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cài đặt hội thoại' }} />
      <Text style={styles.text}>Quản lý hội thoại, cài đặt AI và trải nghiệm trò chuyện.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default ChatSettingsScreen;
