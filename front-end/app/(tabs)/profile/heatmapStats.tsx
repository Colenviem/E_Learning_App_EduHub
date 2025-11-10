import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const MAU = {
  nen: "#F8FAFC",
  headerBg: "#5E72E4",
  cardBg: "#FFFFFF",
  chuChinh: "#1E293B",
  chuPhu: "#64748B",
  accent: "#5E72E4",
  thanh: "#E2E8F0",
};

export default function HeatMapStats() {
  const labels = ["HTML", "CSS", "JS", "React", "Node"];
  const data = [80, 70, 60, 50, 40];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
  options={{
    headerShown: true,
    title: "Thống kê kỹ năng",
    headerStyle: { backgroundColor: MAU.headerBg },
    headerTintColor: "#FFF",
    headerTitleStyle: { fontWeight: "bold" },
    headerTitleAlign: "center", 
  }}
/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Tổng quan kỹ năng lập trình</Text>

        <View style={styles.chartCard}>
          <BarChart
            data={{
              labels,
              datasets: [{ data }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(94, 114, 228, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              propsForBackgroundLines: {
                strokeWidth: 1,
                stroke: "#E2E8F0",
                strokeDasharray: "0",
              },
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Feather name="check-circle" size={24} color="#48BB78" />
            <Text style={styles.infoText}>Bài học hoàn thành: <Text style={styles.infoStrong}>3</Text></Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="clock" size={24} color="#F6AD55" />
            <Text style={styles.infoText}>Thời gian học: <Text style={styles.infoStrong}>45 phút</Text></Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>💡 Nhận xét tổng quan</Text>
          <Text style={styles.summaryText}>
            Bạn đang có nền tảng tốt ở <Text style={styles.highlight}>HTML</Text> và <Text style={styles.highlight}>CSS</Text>,
            nhưng cần luyện thêm về <Text style={styles.highlight}>JavaScript</Text> và <Text style={styles.highlight}>React</Text> để nâng cao kỹ năng front-end.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MAU.nen,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 22,
    color: MAU.chuChinh,
    textAlign: "center",
  },

  chartCard: {
    backgroundColor: MAU.cardBg,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 30,
  },

  infoCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

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
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: MAU.chuPhu,
    fontWeight: "500",
  },

  infoStrong: {
    color: MAU.chuChinh,
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: MAU.accent,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: MAU.accent,
  },

  summaryText: {
    fontSize: 15,
    color: MAU.chuPhu,
    lineHeight: 22,
    textAlign: "justify",
  },

  highlight: {
    color: MAU.accent,
    fontWeight: "600",
  },
});
