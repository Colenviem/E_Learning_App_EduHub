import { Poppins_500Medium, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

// ======================= THEME CONTEXT =======================
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('isDarkMode').then(value => {
      if (value !== null) setIsDarkMode(value === 'true');
    });
  }, []);

  const toggleTheme = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    AsyncStorage.setItem('isDarkMode', newValue ? 'true' : 'false');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ======================= ROOT LAYOUT =======================
const RootLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const startSplashAnimation = useCallback(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          delay: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setIsReady(true));
  }, [scale, opacity]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
      startSplashAnimation();
    }
  }, [fontsLoaded, startSplashAnimation]);

  useEffect(() => {
    onLayoutRootView();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="lesson-details"
          options={{
            title: 'Chi tiết bài học',
            headerShown: true,
            headerBackTitle: '',
          }}
        />
      </Stack>

      {!isReady && (
        <Animated.View style={[styles.splashContainer, { opacity }]}>
          <Animated.Image
            source={require('../assets/images/logo.jpg')}
            resizeMode="contain"
            style={[styles.logo, { transform: [{ scale }] }]}
          />
        </Animated.View>
      )}
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});

export default RootLayout;
