import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PromoScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Khuyến mãi Premium' }} />
      <Text style={styles.text}>Nhập mã khuyến mãi để nhận ưu đãi khi nâng cấp Premium.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default PromoScreen;
