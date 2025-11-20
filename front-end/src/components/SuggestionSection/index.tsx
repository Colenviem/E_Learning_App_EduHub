import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuggestionCardProps {
  title: string;
  image: string;
  rating: number;
  numberOfParticipants: number;
  time: string;
  price: number;
  discount: number;
  onPress?: () => void;
  colors?: {
    cardBg?: string;
    titleColor?: string;
    textColor?: string;
    priceColor?: string;
    oldPriceColor?: string;
    ratingColor?: string;
  };
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title, image, rating, numberOfParticipants, time, price, discount, onPress, colors = {}
}) => {
  const formatNumber = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  const finalPrice = price - (price * discount / 100);

  return (
    <TouchableOpacity style={[suggestionStyles.card, { backgroundColor: colors.cardBg || '#FFFFFF', borderColor: colors.cardBg ? 'transparent' : '#F3F4F6' }]} activeOpacity={0.7} onPress={onPress}>
      <Image source={{ uri: image }} style={suggestionStyles.image} />
      <View style={suggestionStyles.content}>
        <Text style={[suggestionStyles.title, { color: colors.titleColor || '#1F2937' }]} numberOfLines={2}>{title}</Text>
        <View style={suggestionStyles.infoRow}>
          <View style={suggestionStyles.ratingContainer}>
            <Text style={suggestionStyles.ratingStar}>⭐</Text>
            <Text style={[suggestionStyles.ratingText, { color: colors.ratingColor || '#F59E0B' }]}>{rating}</Text>
          </View>
          <Text style={[suggestionStyles.participants, { color: colors.textColor || '#6B7280' }]}>{formatNumber(numberOfParticipants)} học viên</Text>
        </View>
        <Text style={[suggestionStyles.time, { color: colors.textColor || '#6B7280' }]}>⏱ {time}</Text>
        <View style={suggestionStyles.priceRow}>
          {discount > 0 && <Text style={[suggestionStyles.oldPrice, { color: colors.oldPriceColor || '#9CA3AF' }]}>{price.toLocaleString('vi-VN')}đ</Text>}
          <Text style={[suggestionStyles.price, { color: colors.priceColor || '#EF4444' }]}>{finalPrice.toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SuggestionSection: React.FC<{ colors?: SuggestionCardProps['colors'] }> = ({ colors }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTopRatedCourses = async () => {
      try {
        const res = await fetch('http://192.168.0.102:5000/courses/top-rated');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Lỗi fetch top-rated courses:', err);
      }
    };

    fetchTopRatedCourses();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors?.titleColor || '#1F2937' }]}>Gợi ý đề xuất</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('./explore/suggestion-detail')}>
          <Text style={[styles.linkText, { color: colors?.ratingColor || '#3B82F6' }]}>Hiển thị tất cả &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {courses.map(course => (
          <SuggestionCard
            key={course._id}
            {...course}
            onPress={() => router.push(`../course-lessons/?courseId=${course._id}`)}
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: 0.3 },
  linkText: { fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingVertical: 5 },
});

const suggestionStyles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingStar: { fontSize: 14, marginRight: 4 },
  ratingText: { fontSize: 13, fontWeight: '700' },
  participants: { fontSize: 11, fontWeight: '500' },
  time: { fontSize: 12, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  oldPrice: { fontSize: 12, textDecorationLine: 'line-through' },
  price: { fontSize: 16, fontWeight: '800' },
});

export default SuggestionSection;
