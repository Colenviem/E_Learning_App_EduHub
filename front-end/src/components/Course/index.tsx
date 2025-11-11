import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CourseProps {
  _id: string;
  title: string;
  image: string;
  rating: number;
}

const Course: React.FC<CourseProps> = ({ _id, title, image, rating }) => {
  const handlePress = () => {
    router.push({
      pathname: '/course-lessons',
      params: { id: _id },
    });
  };

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

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
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
});

export default Course;