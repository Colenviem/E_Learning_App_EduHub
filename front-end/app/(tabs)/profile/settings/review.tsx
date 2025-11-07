import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ReviewScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Đánh giá EduHub' }} />
      <Text style={styles.text}>Hãy đánh giá ứng dụng để chúng tôi cải thiện trải nghiệm!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đánh giá ngay</Text>
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

export default ReviewScreen;
