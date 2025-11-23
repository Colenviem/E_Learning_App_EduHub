import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import ChatUI from '../src/components/ChatUI';
import { StartButton } from '../src/components/StartButton';

const Onboarding = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    messages,
    sendBotMessage,
    handleAnswer,
    handlePickTime,
    flatListRef,
    showPicker,
    pickedTime
  } = useChat();


  if (!started) {
    return (
      <SafeAreaView style={styles.onboardingSafeArea}>
        <View style={styles.onboardingContent}>
          <View style={styles.header}>
            <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
          </View>

          <View style={styles.onboardingMiddle}>
            <Text style={styles.title}>Chào mừng đến EduHub</Text>
            <Text style={styles.subtitle}>
              Truy cập hàng trăm khóa học và tài nguyên dành cho lập trình viên từ cơ bản đến nâng cao.
            </Text>
          </View>

          <View style={styles.startButtonWrapper}>
            <StartButton
              loading={loading}
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  setStarted(true);
                  setLoading(false);
                  if (sendBotMessage) {
                    sendBotMessage(0);
                  }
                }, 800);
              }}

            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {messages && flatListRef ? (
        <ChatUI
          messages={messages}
          flatListRef={flatListRef}
          handleAnswer={handleAnswer}
          handlePickTime={handlePickTime}
          showPicker={showPicker}
          pickedTime={pickedTime}
        />

      ) : null}
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12121B',
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  onboardingSafeArea: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  onboardingMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonWrapper: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subtitle: { fontSize: 18, color: '#B0B0FF', textAlign: 'center', lineHeight: 26 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6C63FF', marginBottom: 16, textAlign: 'center' },
  header: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  logo: { width: 140, height: 140, borderRadius: 30, marginBottom: 16 },
});
