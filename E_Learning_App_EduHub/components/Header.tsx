import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface HeaderProps { name: string; }

const Header: React.FC<HeaderProps> = ({ name }) => {
  const router = useRouter(); 

  return (
    <View style={styles.container}>

      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greetingText}>
            Xin chào, <Text style={styles.nameText}>{name}!</Text>
          </Text>
          <Text>Tìm bài học của bạn ngay hôm nay!</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/notifications')} 
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>


      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/search')} 
        style={styles.searchBar}
      >
        <Feather name="search" size={20} color={colors.grayText} style={styles.searchIcon} />
        <Text style={styles.placeholderText}>Tìm kiếm...</Text>
        <Ionicons name="options-outline" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.md },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greetingText: { ...typography.h1, fontSize: 24, fontWeight: '400' },
  nameText: { fontWeight: '700' },
  iconButton: { padding: spacing.sm / 2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    height: 56,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
    opacity: 0.7,
  },
  placeholderText: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    color: colors.grayText,
  },

  searchInput: { flex: 1, ...typography.body, fontSize: 16, paddingVertical: 0 },
  filterButton: { paddingLeft: spacing.md },
});

export default Header;
