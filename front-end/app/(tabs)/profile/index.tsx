import { Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import React, { ReactNode, useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../_layout';

const API_BASE_URL = 'http://192.168.0.102:5000';

type TheThongKeProps = { giaTri: string; nhan: string };
type ThucNangItemProps = { icon: ReactNode; tieuDe: string; phuDe?: string; onPress: () => void };

const formatMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
};

const TheThongKe = ({ giaTri, nhan }: TheThongKeProps) => {
    const { isDarkMode } = useTheme();

    const colors = {
        cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#333333',
        subText: isDarkMode ? '#BBBBBB' : '#666666',
    };

    return (
        <View style={[profileStyles.theThongKe, { backgroundColor: colors.cardBg }]}>
            <Text style={[profileStyles.giaTri, { color: colors.text }]}>{giaTri}</Text>
            <Text style={[profileStyles.nhan, { color: colors.subText }]}>{nhan}</Text>
        </View>
    );
};

const ThucNangItem = ({ icon, tieuDe, phuDe, onPress }: ThucNangItemProps) => {
    const { isDarkMode } = useTheme();

    const colors = {
        cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#333333',
        subText: isDarkMode ? '#BBBBBB' : '#666666',
    };

    return (
        <TouchableOpacity style={[profileStyles.itemThucNang, { backgroundColor: colors.cardBg }]} onPress={onPress}>
            <View style={profileStyles.iconThucNang}>{icon}</View>
            <View style={profileStyles.textThucNang}>
                <Text style={[profileStyles.tieuDe, { color: colors.text }]}>{tieuDe}</Text>
                {phuDe && <Text style={[profileStyles.phuDe, { color: colors.subText }]}>{phuDe}</Text>}
            </View>
            <Feather name="chevron-right" size={18} color={colors.subText} />
        </TouchableOpacity>
    );
};

export default function ManHinhProfile() {
    const [user, setUser] = useState<any>(null);
    const { isDarkMode } = useTheme();

    const colors = {
        background: isDarkMode ? '#121212' : '#F7F7F7',
        headerBg: isDarkMode ? '#1E1E1E' : '#B3EBC8',
        cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        text:'#333333',
        subText: isDarkMode ? '#BBBBBB' : '#666666',
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchUser = async () => {
                try {
                    const storedUserId = await AsyncStorage.getItem("userId");
                    if (!storedUserId) return;

                    const res = await fetch(`${API_BASE_URL}/users/byAccount/${storedUserId}`);
                    const data = await res.json();

                    if (isActive) {
                        setUser(data);
                    }
                } catch (err) {
                    console.log("Lỗi load user:", err);
                }
            };

            fetchUser();
            return () => { isActive = false; };
        }, [])
    );

    return (
        <SafeAreaView style={[profileStyles.safeArea, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={profileStyles.scrollContent}>

            <View style={[profileStyles.headerNen, { backgroundColor: user?.backgroundColor ?? colors.headerBg }]}>

                    <View style={profileStyles.headerIcons}>
                        <TouchableOpacity onPress={() => router.push('/profile/settings')}>
                            <Feather name="settings" size={24} color={colors.text} />
                        </TouchableOpacity>

                        <View style={profileStyles.headerPhai}>
                            <TouchableOpacity onPress={() => router.push('./profile/edit')}>
                                <Feather name="edit" size={20} color={colors.text} style={{ marginRight: 15 }} />
                            </TouchableOpacity>
                            <Text style={[profileStyles.lua, { backgroundColor: colors.cardBg, color: colors.subText }]}>
                                🔥 {user?.streak || 0}
                            </Text>
                        </View>
                    </View>

                    <View style={profileStyles.userInfo}>
                        <Text style={[profileStyles.tenNguoiDung, { color: colors.text }]}>
                            {user?.name ?? 'Người dùng'}
                        </Text>

                        {user && user.avatarUrl ? (
                            <Image
                                source={{ uri: user.avatarUrl }}
                                style={profileStyles.avatarImage}
                            />
                        ) : (
                            <View
                                style={[
                                    profileStyles.avatar,
                                    { backgroundColor: isDarkMode ? '#444' : '#FFEB3B' }
                                ]}
                            />
                        )}
                    </View>

                </View>

                <View style={profileStyles.khuVucThongKe}>
                    <TheThongKe
                        giaTri={(user?.coursesInProgress?.length || 0).toString()}
                        nhan="Bài học hoàn thành"
                    />
                    <TheThongKe
                        giaTri={formatMinutes(user?.totalActiveMinutes || 0)}
                        nhan="Thời gian thực hành"
                    />
                </View>

                <View style={profileStyles.khuVucThucNang}>
                    <ThucNangItem
                        icon={<Feather name="code" size={20} color={colors.text} />}
                        tieuDe="Thống kê kỹ năng lập trình"
                        phuDe="Bạn chưa hoàn thành bài học nào. Hãy bắt đầu học để xem thống kê!"
                        onPress={() => router.push('./profile/heatmapStats')}
                    />

                    <ThucNangItem
                        icon={<FontAwesome5 name="trophy" size={20} color="#FFD700" />}
                        tieuDe="Thành tựu"
                        phuDe="Hoàn thành bài học để nhận thành tựu!"
                        onPress={() => router.push('./profile/achievements')}
                    />

                    <ThucNangItem
                        icon={<Feather name="lock" size={20} color={colors.subText} />}
                        tieuDe="Ôn tập"
                        onPress={() => router.push('./profile/review')}
                    />

                    <ThucNangItem
                        icon={<Feather name="bookmark" size={20} color="#805AD5" />}
                        tieuDe="Đã lưu"
                        onPress={() => router.push('./saved')}
                    />

                    <ThucNangItem
                        icon={<Feather name="check-square" size={20} color="#48BB78" />}
                        tieuDe="Xem lại bài tập đã hoàn thành"
                        onPress={() => router.push('./profile/completed')}
                    />

                    <ThucNangItem
                        icon={<Feather name="clock" size={20} color="#F6AD55" />}
                        tieuDe="Lịch sử thực hành"
                        onPress={() => router.push('./profile/history')}
                    />

                    <ThucNangItem
                        icon={<Feather name="trending-up" size={20} color="#DD6B20" />}
                        tieuDe="Đánh giá kỹ năng lập trình"
                        onPress={() => router.push('./profile/assessment')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const profileStyles = StyleSheet.create({
    safeArea: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    headerNen: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 40 },
    headerIcons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerPhai: { flexDirection: 'row', alignItems: 'center' },
    lua: { fontSize: 16, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },

    userInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tenNguoiDung: { fontSize: 32, fontWeight: '900' },

    avatar: { width: 60, height: 60, borderRadius: 30 },
    avatarImage: { width: 60, height: 60, borderRadius: 30, resizeMode: 'cover' },

    khuVucThongKe: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -30,
        marginBottom: 20
    },
    theThongKe: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    giaTri: { fontSize: 20, fontWeight: 'bold' },
    nhan: { fontSize: 14 },

    khuVucThucNang: { paddingHorizontal: 20 },
    itemThucNang: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    iconThucNang: { width: 30, marginTop: 3, alignItems: 'center' },
    textThucNang: { flex: 1, marginLeft: 10 },
    tieuDe: { fontSize: 16, fontWeight: '600' },
    phuDe: { fontSize: 12, lineHeight: 16 },
});
