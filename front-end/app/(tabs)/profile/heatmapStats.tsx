import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const MAU = {
  nen: "#F8FAFC",
  headerBg: "#5E72E4",
  cardBg: "#FFFFFF",
  chuChinh: "#1E293B",
  chuPhu: "#64748B",
  accent: "#5E72E4",
};

import { API_BASE_URL } from '@/src/api';

export default function HeatMapStats() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          console.log("Không tìm thấy userId trong AsyncStorage");
          setLoading(false);
          return;
        }
        setUserId(storedUserId);

        const [uRes, cRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`),
          fetch(`${API_BASE_URL}/courses`),
        ]);

        if (!uRes.ok) throw new Error("Cannot fetch user");
        if (!cRes.ok) throw new Error("Cannot fetch courses");

        const userData = await uRes.json();
        const coursesData = await cRes.json();

        const courseMap = Object.fromEntries(
          coursesData.map((course: any) => [course._id, course.title])
        );

        const merged = userData.coursesInProgress.map((item: any) => ({
          ...item,
          title: (courseMap[item.courseId] || item.courseId).replace(/^Learn\s+/i, ""),
        }));

        setUser({ ...userData, coursesInProgress: merged });
      } catch (e) {
        console.error("Lỗi fetch dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndData();
  }, []);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={MAU.accent} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );

  if (!user)
    return (
      <View style={styles.loadingContainer}>
        <Text>Không có dữ liệu người dùng.</Text>
      </View>
    );

  const labels = user.coursesInProgress.map((c: any) => c.title);
  const data = user.coursesInProgress.map((c: any) => Math.round(c.progress * 100));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê lập trình</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userSubtitle}>
              🔥 {user.streak} ngày liên tiếp | ⏱ {user.totalActiveMinutes} phút học
            </Text>
          </View>
        </View>

        <Text style={styles.title}>📊 Tiến độ học theo khóa</Text>

        <View style={styles.chartCard}>
          <BarChart
            data={{ labels, datasets: [{ data }] }}
            width={screenWidth - 40}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              propsForBackgroundLines: { strokeWidth: 1, stroke: "#E2E8F0", strokeDasharray: "0" },
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Feather name="book-open" size={24} color="#48BB78" />
            <Text style={styles.infoText}>
              Số khóa học đang học: <Text style={styles.infoStrong}>{user.coursesInProgress.length}</Text>
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="activity" size={24} color="#F6AD55" />
            <Text style={styles.infoText}>
              Chuỗi ngày học: <Text style={styles.infoStrong}>{user.streak} ngày</Text>
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>💡 Nhận xét tổng quan</Text>
          <Text style={styles.summaryText}>
            Bạn đang duy trì học khá đều đặn với {user.streak} ngày liên tiếp và tổng thời gian học{" "}
            {user.totalActiveMinutes} phút. Hãy cố gắng hoàn thành khóa học để đạt thành tựu mới nhé!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: MAU.nen },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    padding: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 22,
    color: MAU.chuChinh,
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  userSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  chartCard: {
    backgroundColor: MAU.cardBg,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  infoCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: { marginLeft: 10, fontSize: 15, color: MAU.chuPhu, fontWeight: "500" },
  infoStrong: { color: MAU.chuChinh, fontWeight: "700" },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: MAU.accent,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: MAU.accent },
  summaryText: { fontSize: 15, color: MAU.chuPhu, lineHeight: 22, textAlign: "justify" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
