import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RestoreScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Khôi phục mua hàng' }} />
      <Text style={styles.text}>Khôi phục các giao dịch Premium trước đây của bạn.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default RestoreScreen;
