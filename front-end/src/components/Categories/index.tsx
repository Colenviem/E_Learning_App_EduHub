import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface CategoryProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}

function Categories({ categories, selectedCategory, setSelectedCategory }: CategoryProps) {
  return (
    <View style={{ marginTop: 16, marginBottom: 12 }}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const isActive = selectedCategory === item._id; // ✅ so sánh với _id

          return (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item._id)} // ✅ set _id
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isActive ? '#7C3AED' : '#FFFFFF',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                marginRight: 10,
                borderWidth: 1,
                borderColor: '#7C3AED',
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={18} 
                color={isActive ? '#FFFFFF' : '#7C3AED'} 
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: '600',
                  color: isActive ? '#FFFFFF' : '#7C3AED',
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default Categories;