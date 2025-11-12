import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAU = {
    nen: '#F7F7F7',
    headerBg: '#B3EBC8',
    cardBg: '#FFFFFF',
    chuChinh: '#333333',
    chuPhu: '#666666',
    accent: '#5E72E4',
};

const USER_ID = 'USER001';

type TheThongKeProps = { giaTri: string; nhan: string };
type ThucNangItemProps = { icon: ReactNode; tieuDe: string; phuDe?: string; onPress: () => void };

const TheThongKe = ({ giaTri, nhan }: TheThongKeProps) => (
    <View style={profileStyles.theThongKe}>
        <Text style={profileStyles.giaTri}>{giaTri}</Text>
        <Text style={profileStyles.nhan}>{nhan}</Text>
    </View>
);
const formatMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
};
const formatDays = (totalDays: number) => {
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    let result = '';
    if (months > 0) result += `${months} tháng `;
    if (days > 0 || months === 0) result += `${days} ngày`;
    return result;
};


const ThucNangItem = ({ icon, tieuDe, phuDe, onPress }: ThucNangItemProps) => (
    <TouchableOpacity style={profileStyles.itemThucNang} onPress={onPress}>
        <View style={profileStyles.iconThucNang}>{icon}</View>
        <View style={profileStyles.textThucNang}>
            <Text style={profileStyles.tieuDe}>{tieuDe}</Text>
            {phuDe && <Text style={profileStyles.phuDe}>{phuDe}</Text>}
        </View>
        <Feather name="chevron-right" size={18} color="#C0C0C0" />
    </TouchableOpacity>
);

export default function ManHinhProfile() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://192.168.0.102:5000/users/${USER_ID}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error('Lỗi fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={[profileStyles.headerNen, { backgroundColor: user?.backgroundColor || MAU.headerBg }]}>
                    <View style={profileStyles.headerIcons}>
                        <TouchableOpacity onPress={() => router.push('/profile/settings')}>
                            <Feather name="settings" size={24} color={MAU.chuChinh} />
                        </TouchableOpacity>
                        <View style={profileStyles.headerPhai}>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit')}>
                                <Feather name="edit" size={20} color={MAU.chuChinh} style={{ marginRight: 15 }} />
                            </TouchableOpacity>
                            <Text style={profileStyles.lua}>🔥 {user?.streak || 0}</Text>
                        </View>
                    </View>

                    <View style={profileStyles.userInfo}>
                        <Text style={profileStyles.tenNguoiDung}>{user?.name || 'Người dùng'}</Text>
                        {user?.avatarUrl ? (
                            <Image source={{ uri: user.avatarUrl }} style={profileStyles.avatarImage} />
                        ) : (
                            <View style={profileStyles.avatar} />
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
                        icon={<Feather name="code" size={20} color={MAU.accent} />}
                        tieuDe="Thống kê kỹ năng lập trình"
                        phuDe="Bạn chưa hoàn thành bài học nào. Hãy bắt đầu học để xem thống kê kỹ năng lập trình của bạn!"
                        onPress={() => router.push('./profile/heatmapStats')}
                    />
                    <ThucNangItem
                        icon={<FontAwesome5 name="trophy" size={20} color="#FFD700" />}
                        tieuDe="Thành tựu"
                        phuDe="Bạn chưa đạt được thành tựu nào. Hoàn thành các bài học để nhận thành tựu!"
                        onPress={() => router.push('./profile/achievements')}
                    />
                    <ThucNangItem
                        icon={<Feather name="lock" size={20} color="#666" />}
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

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: MAU.nen },
    scrollContent: { paddingBottom: 100 },
});

const profileStyles = StyleSheet.create({
    headerNen: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 40 },
    headerIcons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerPhai: { flexDirection: 'row', alignItems: 'center' },
    lua: { fontSize: 16, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, backgroundColor: MAU.cardBg, color: MAU.chuPhu },
    userInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tenNguoiDung: { fontSize: 32, fontWeight: '900', color: MAU.chuChinh },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFEB3B' },
    avatarImage: { width: 60, height: 60, borderRadius: 30, resizeMode: 'cover' },

    khuVucThongKe: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -30, marginBottom: 20 },
    theThongKe: { flex: 1, marginHorizontal: 5, backgroundColor: MAU.cardBg, borderRadius: 15, padding: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    giaTri: { fontSize: 20, fontWeight: 'bold', color: MAU.chuChinh },
    nhan: { fontSize: 14, color: MAU.chuPhu },

    khuVucThucNang: { paddingHorizontal: 20 },
    itemThucNang: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, backgroundColor: MAU.cardBg, borderRadius: 10, marginBottom: 10, paddingHorizontal: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    iconThucNang: { width: 30, marginTop: 3, alignItems: 'center' },
    textThucNang: { flex: 1, marginLeft: 10 },
    tieuDe: { fontSize: 16, fontWeight: '600', color: MAU.chuChinh, marginBottom: 3 },
    phuDe: { fontSize: 12, color: MAU.chuPhu, lineHeight: 16 },
});
