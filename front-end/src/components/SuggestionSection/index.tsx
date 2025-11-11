import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SUGGESTION_DATA = [
  { 
    id: '1', 
    title: 'Học TypeScript nâng cao', 
    subtitle: 'Cải thiện code an toàn hơn', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/919/919828.png"}', 
  },
  { 
    id: '2', 
    title: 'React Hooks chuyên sâu', 
    subtitle: 'Tối ưu state và effect', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/919/919851.png"}',
  },
  { 
    id: '3', 
    title: 'Node.js API & Express', 
    subtitle: 'Xây dựng backend hiệu quả', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/919/919825.png"}',
  },
  { 
    id: '4', 
    title: 'Test với Jest & RTL', 
    subtitle: 'Viết test cho dự án React', 
    icon: '{"uri": "https://cdn-icons-png.flaticon.com/512/919/919836.png"}',
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