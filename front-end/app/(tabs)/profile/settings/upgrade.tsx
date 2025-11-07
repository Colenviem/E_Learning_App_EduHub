import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UpgradeScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Nâng cấp Premium' }} />
      <Text style={styles.text}>Mở khóa tất cả tính năng và ưu đãi khi nâng cấp Premium!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Nâng cấp ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default UpgradeScreen;
