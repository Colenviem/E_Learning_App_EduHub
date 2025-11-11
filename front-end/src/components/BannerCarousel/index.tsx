import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { borderRadius, colors, SCREEN_CONSTANTS, spacing } from '../../constants/theme';

interface Props {
  banners: any[];
  carouselRef: any;
}

export default function BannerCarousel({ banners, carouselRef }: Props) {
  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        data={banners}
        width={SCREEN_CONSTANTS.CAROUSEL_WIDTH}
        height={160}
        loop
        autoPlay
        autoPlayInterval={4000}
        renderItem={({ item }) => (
          <View style={styles.bannerWrapper}>
            <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />
            <View style={styles.bannerOverlay}>
              <View style={styles.bannerBadge}>
                <MaterialIcons name="whatshot" size={14} color={colors.secondaryAccent} />
                <Text style={styles.bannerBadgeText}>Phổ biến</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  bannerWrapper: {
    width: SCREEN_CONSTANTS.CAROUSEL_WIDTH,
    height: 160,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryAccent,
  },
});
