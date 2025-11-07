import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Hỗ trợ' }} />
      <Text style={styles.text}>Liên hệ bộ phận hỗ trợ để được giúp đỡ về tài khoản và ứng dụng.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default SupportScreen;
