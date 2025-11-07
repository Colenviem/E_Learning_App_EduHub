import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cài đặt thông báo' }} />
      <Text style={styles.text}>Tắt/Bật thông báo, nhắc nhở và các thông tin quan trọng khác.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default NotificationsScreen;
