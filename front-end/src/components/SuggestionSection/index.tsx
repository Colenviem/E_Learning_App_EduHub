import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SUGGESTION_DATA = [
  { 
    id: '1', 
    title: 'Kế hoạch học tập', 
    subtitle: 'Tùy chỉnh lịch học',
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/3050/3050965.png"}', // Icon placeholder 
  },
  { 
    id: '2', 
    title: 'Gia sư cho người mới bắt đầu', 
    subtitle: 'Nơi làm việc sơ cấp', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/3050/3050965.png"}', // Icon placeholder
  },
  { 
    id: '3', 
    title: 'Luyện kỹ năng phỏng vấn', 
    subtitle: 'Nâng cao khả năng giao tiếp', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/3050/3050965.png"}', // Icon placeholder
  },
];

interface SuggestionCardProps {
  title: string;
  subtitle: string;
  icon: any; 
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ title, subtitle, icon }) => (
  <TouchableOpacity style={suggestionStyles.card}>
    <Image 
        source={JSON.parse(icon)} 
        style={suggestionStyles.icon} 
    />
    
    <Text style={suggestionStyles.title} numberOfLines={2}>{title}</Text>
    <Text style={suggestionStyles.subtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const SuggestionSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gợi ý đề xuất</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Hiển thị tất cả &gt;</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {SUGGESTION_DATA.map(suggest => (
          <SuggestionCard key={suggest.id} {...suggest} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    linkText: {
        fontSize: 14,
        color: '#3F83F8',
        fontWeight: '600',
    },
    scrollContent: {
        paddingVertical: 5,
    }
});

const suggestionStyles = StyleSheet.create({
    card: {
        width: 140, 
        marginRight: 15,
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#F7F7F7', 
        height: 140,
        justifyContent: 'space-between',
    },
    icon: {
        width: 32,
        height: 32,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    }
});

export default SuggestionSection;