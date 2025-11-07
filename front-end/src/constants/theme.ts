import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  screenPadding: 20,
};

export const colors = {
  primaryBlue: '#007BFF',
  secondaryAccent: '#5F54E7',
  background: '#FFFFFF',
  cardBackground: '#F4F5F7',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#FFFFFF',
  grayText: '#A1A1AA',
  lightBorder: '#E5E7EB',
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  card: 24,
  button: 10,
  bottomTab: 30,
};

export const typography = {
  fontFamily: 'System',
  h1: { fontSize: 28, fontWeight: '700' as '700', color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '600' as '600', color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: '400' as '400', color: colors.textPrimary },
  caption: { fontSize: 14, fontWeight: '400' as '400', color: colors.textSecondary },
};

export const gradients = {
  featuredCard: ['#5F54E7', '#007BFF'],
};


export const SCREEN_CONSTANTS = {
  SCREEN_WIDTH,
  COURSE_CARD_WIDTH: (SCREEN_WIDTH - 3 * 16) / 2,
  CAROUSEL_WIDTH: SCREEN_WIDTH - 32, 
};
