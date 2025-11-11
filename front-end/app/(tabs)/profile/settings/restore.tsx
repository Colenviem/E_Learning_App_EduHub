import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MAU = {
  nen: "#F7F7F7",
  cardBg: "#FFFFFF",
  accent: "#5E72E4",
  text: "#333",
  sub: "#666",
  success: "#48BB78",
};

const RestoreScreen = () => {
  const [purchases, setPurchases] = useState([
    {
      id: "1",
      date: "15/09/2025",
      plan: "Gói Premium 1 tháng",
      price: "79.000đ",
      status: "Đã mua",
    },
    {
      id: "2",
      date: "15/10/2025",
      plan: "Gói Premium 3 tháng",
      price: "199.000đ",
      status: "Đã mua",
    },
  ]);

  const handleRestore = () => {
    Alert.alert(
      "Khôi phục thành công 🎉",
      "Các giao dịch Premium của bạn đã được khôi phục."
    );
  };

  const renderPurchase = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Feather name="check-circle" size={20} color={MAU.success} />
        <Text style={styles.plan}>{item.plan}</Text>
      </View>

      <Text style={styles.date}>Ngày mua: {item.date}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Khôi phục mua hàng",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: '#A78BFA' },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      <Text style={styles.intro}>
        Nếu bạn đã từng mua gói Premium trước đây, bạn có thể khôi phục giao
        dịch tại đây.
      </Text>

      {purchases.length > 0 ? (
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={renderPurchase}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.empty}>Không có giao dịch nào được tìm thấy.</Text>
      )}

      <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
        <Feather name="refresh-ccw" size={20} color="#FFF" />
        <Text style={styles.restoreText}>Khôi phục giao dịch</Text>
      </TouchableOpacity>
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
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: MAU.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  plan: {
    marginLeft: 8,
    fontWeight: "700",
    color: MAU.text,
    fontSize: 16,
  },
  date: {
    fontSize: 13,
    color: MAU.sub,
  },
  footer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "600",
    color: MAU.accent,
  },
  status: {
    fontSize: 13,
    color: MAU.success,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: MAU.sub,
    marginTop: 40,
  },
  restoreBtn: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: MAU.accent,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restoreText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default RestoreScreen;
