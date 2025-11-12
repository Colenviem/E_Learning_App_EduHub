import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  primary: '#A78BFA',
  textPrimary: '#1E1E2A',
  textSecondary: '#6A6A6A',
  border: '#E0E0E0',
};

export type Lesson = {
  _id: string;
  title: string;
  time: string; // ví dụ "45 phút"
};

type LessonItemProps = {
  lesson: Lesson;
  index: number;
  onPress?: () => void;
};

export const LessonItem: React.FC<LessonItemProps> = ({ lesson, index, onPress }) => {
  // 🕒 Hàm chuyển "45 phút" → "0 giờ 45 phút" hoặc "8 giờ 40 phút"
  const formatTime = (timeString: string) => {
    // Tách số phút từ chuỗi (vd: "520 phút" → 520)
    const totalMinutes = parseInt(timeString.replace(/[^\d]/g, ''), 10) || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ''}`;
    return `${minutes} phút`;
  };

  const displayTime = formatTime(lesson.time);

  return (
    <TouchableOpacity style={styles.lessonItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.lessonIndex}>{index + 1}.</Text>

      <View style={styles.lessonTextWrapper}>
        <Text style={styles.lessonName} numberOfLines={1}>
          {lesson.title}
        </Text>
        <Text style={styles.lessonDuration}>{displayTime}</Text>
      </View>

      <IonIcon name="play-circle-outline" size={28} color={COLORS.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lessonIndex: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  lessonTextWrapper: {
    flex: 1,
    marginRight: 10,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  lessonDuration: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});