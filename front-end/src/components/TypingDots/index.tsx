import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const TypingDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.stagger(150, [
        Animated.sequence([
          Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot1, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.3] }) }],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, dotStyle(dot1)]} />
      <Animated.View style={[styles.dot, dotStyle(dot2)]} />
      <Animated.View style={[styles.dot, dotStyle(dot3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginHorizontal: 2 },
});
