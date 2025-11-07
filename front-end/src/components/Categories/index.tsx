import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../../styles/home';

interface CategoryProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

export default function Categories({ categories, selectedCategory, setSelectedCategory }: CategoryProps) {
  return (
    <View style={styles.categoriesSection}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.id)}
            style={[
              styles.categoryButton,
              selectedCategory === item.id && styles.categoryButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name={item.icon as any} 
              size={18} 
              color={selectedCategory === item.id ? '#FFFFFF' : '#A78BFA'} 
            />
            <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
