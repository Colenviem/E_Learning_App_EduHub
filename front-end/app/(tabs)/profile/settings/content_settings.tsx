import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ContentSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cài đặt nội dung' }} />
      <Text style={styles.text}>Quản lý nội dung hiển thị, đề xuất và chủ đề yêu thích.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default ContentSettingsScreen;
