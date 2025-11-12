import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface CourseItem {
  _id: string;
  title: string;
  image: string;
  rating: number;
  numberOfParticipants: number;
  numberOfLessons: number;
  time: string;
  price?: number;
  discount?: number;
}

interface CourseProps {
  item: CourseItem;
}

const Course: React.FC<CourseProps> = ({ item }) => {
  const {
    _id,
    title,
    image,
    rating,
    numberOfParticipants,
    numberOfLessons,
    time,
    price,
    discount,
  } = item;

  const handlePress = () => {
    router.push({
      pathname: '/course-lessons',
      params: { courseId: _id },
    });
  };

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours} h${minutes > 0 ? ` ${minutes} p` : ''}`;
    }
    return `${minutes} p`;
  };

  const totalMinutes = parseInt(time.replace(' phút', ''), 10);
  const displayTime = formatTime(totalMinutes);

  const displayPrice = price
    ? `${(price * (1 - (discount || 0) / 100)).toLocaleString()}₫`
    : 'Miễn phí';

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          defaultSource={require('../../../assets/images/tets.jpg')}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Info row: participants, lessons, time */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialIcons name="people" size={16} color="#7C3AED" />
          <Text style={styles.infoText}>{numberOfParticipants.toLocaleString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="menu-book" size={16} color="#7C3AED" />
          <Text style={styles.infoText}>{numberOfLessons}</Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="schedule" size={16} color="#7C3AED" />
          <Text style={styles.infoText}>{displayTime}</Text>
        </View>
      </View>

      <View style={styles.priceRatingRow}>
        {/* Giá gốc và giá sau giảm */}
        {price && discount ? (
          <View style={styles.priceWrapper}>
            <Text style={styles.originalPrice}>{price.toLocaleString()}₫</Text>
            <Text style={styles.discountPrice}>{displayPrice}</Text>
          </View>
        ) : (
          <Text style={styles.discountPrice}>{displayPrice}</Text>
        )}

        {/* Rating */}
        <View style={styles.ratingWrapper}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
  },
  priceText: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // giá bên trái, rating bên phải
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textDecorationLine: 'line-through', // gạch ngang
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  });

export default Course;