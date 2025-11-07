import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
}

export const AnimatedOption = ({ label, onPress }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={handlePress} style={styles.optionButtonInline}>
        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  chatContainer: { paddingBottom: 24 },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 },
  botMessageWrapper: { justifyContent: 'flex-start', marginLeft: 4 },
  userMessageWrapper: { justifyContent: 'flex-end', marginRight: 4 },
  botIcon: { width: 30, height: 30, marginRight: 8, borderRadius: 15 },
  botMessage: { backgroundColor: '#6C63FF', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, maxWidth: '80%' },
  userMessage: { backgroundColor: '#333', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, maxWidth: '80%' },
  messageText: { color: '#fff', fontSize: 16 },
  typingText: { color: '#fff', fontSize: 16, fontStyle: 'italic', paddingVertical: 4 },
  optionContainerInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '80%',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 8,
    gap: 8,
  },
  optionButtonInline: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 4,
  },
  optionText: { color: '#fff', fontWeight: '600' },
});
