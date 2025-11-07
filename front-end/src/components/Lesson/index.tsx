import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface LessonProps {
  course_id: string;
  id: string;
  lesson: {
    id: string;
    name: string;
    duration: number;
  };
  index: number;
}

const Lesson: React.FC<LessonProps> = ({ course_id, id, lesson, index }) => {
  const handlePress = () => {
    router.push({
      pathname: '/lesson-details',
      params: {
        id: lesson.id,
        course_id,
        lessonNumber: String(index + 1),
      },
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="play-circle" size={24} color="#FF6680" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {index + 1}. {lesson.name}
          </Text>
          <View style={styles.durationContainer}>
            <Icon name="clock" size={14} color="#999" />
            <Text style={styles.duration}>{formatDuration(lesson.duration)}</Text>
          </View>
        </View>

        <Icon name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
});

export default Lesson;