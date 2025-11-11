import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAU = {
  nen: '#F7F7F7',
  cardBg: '#FFFFFF',
  accent: '#5E72E4',
  text: '#333',
  sub: '#666',
  success: '#48BB78',
  warning: '#F6AD55',
};

const PromoScreen = () => {
  const promoData = [
    {
      id: '1',
      code: 'DEV30',
      title: 'Giảm 30% cho lập trình viên mới',
      description: 'Dành cho người học khóa lập trình đầu tiên.',
      expires: 'HSD: 30/11/2025',
      color: '#48BB78',
    },
    {
      id: '2',
      code: 'CODE100',
      title: 'Tặng 1 tháng Premium miễn phí',
      description: 'Khi mua gói Premium 3 tháng liên tiếp.',
      expires: 'HSD: 15/12/2025',
      color: '#5E72E4',
    },
    {
      id: '3',
      code: 'FULLSTACK25',
      title: 'Giảm 25% cho khóa Fullstack',
      description: 'Áp dụng khi đăng ký gói học lập trình toàn diện.',
      expires: 'HSD: 31/12/2025',
      color: '#F6AD55',
    },
  ];

  const handleCopy = (code: any) => {
    Alert.alert('Đã sao chép mã', `Mã ${code} đã được sao chép để sử dụng.`);
  };

  const renderPromo = ({ item }: any) => (
    <View style={[styles.card, { borderLeftColor: item.color }]}>
      <View style={styles.header}>
        <Feather name="gift" size={22} color={item.color} />
        <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
      </View>

      <Text style={styles.desc}>{item.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.expires}>{item.expires}</Text>

        <TouchableOpacity
          style={[styles.copyBtn, { backgroundColor: item.color }]}
          onPress={() => handleCopy(item.code)}
        >
          <Text style={styles.copyText}>{item.code}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Khuyến mãi Premium',
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: '#A78BFA' },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <Text style={styles.intro}>
        💡 Nhập mã khuyến mãi dưới đây để nhận ưu đãi khi nâng cấp lên gói Premium dành cho lập trình viên.
      </Text>

      <FlatList
        data={promoData}
        renderItem={renderPromo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAU.nen,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  intro: {
    fontSize: 15,
    color: MAU.sub,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: MAU.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  desc: {
    fontSize: 14,
    color: MAU.sub,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expires: {
    fontSize: 13,
    color: '#999',
  },
  copyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  copyText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default PromoScreen;
