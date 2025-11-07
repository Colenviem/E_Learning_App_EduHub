import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACHIEVEMENTS_DATA = [
    { id: '1', title: 'Hoàn thành bài học đầu tiên', status: 'achieved', icon: 'star' },
    { id: '2', title: '500 từ vựng đã học', status: 'pending', icon: 'book' },
    { id: '3', title: 'Hoàn thành khóa học cơ bản', status: 'pending', icon: 'award' },
];

type AchievementCardProps = {
    title: string;
    status: 'achieved' | 'pending';
    icon: string;
};

const AchievementCard = ({ title, status, icon }: AchievementCardProps) => (
    <View style={achievementStyles.card}>
        <View style={achievementStyles.iconContainer}>
            <FontAwesome5
                name={icon}
                size={24}
                color={status === 'achieved' ? '#FFD700' : '#A0A0A0'}
            />
        </View>
        <View style={achievementStyles.textContainer}>
            <Text style={achievementStyles.title}>{title}</Text>
            <Text style={achievementStyles.statusText}>
                {status === 'achieved' ? 'Đã đạt được' : 'Tiếp tục cố gắng!'}
            </Text>
        </View>
    </View>
);

const AchievementsScreen = () => {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    return (
        <View style={achievementStyles.container}>
            <Stack.Screen options={{ headerShown: false }} />


            <View style={achievementStyles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={achievementStyles.headerTitle}>Thành tựu</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={achievementStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={achievementStyles.filterBar}>
                    {['Tất cả', 'Đã đạt', 'Chưa đạt'].map(item => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                achievementStyles.filterButton,
                                filter === item.toLowerCase().replace(' ', '_') && achievementStyles.activeFilter
                            ]}
                            onPress={() => setFilter(item.toLowerCase().replace(' ', '_'))}
                        >
                            <Text style={achievementStyles.filterText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={achievementStyles.listContainer}>
                    {ACHIEVEMENTS_DATA.map(achievement => (
                        <AchievementCard
                            key={achievement.id}
                            title={achievement.title}
                            status={achievement.status as 'achieved' | 'pending'}
                            icon={achievement.icon}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const achievementStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: '#F8F8F8',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    activeFilter: {
        backgroundColor: '#E0E0FF',
    },
    filterText: {
        color: '#666',
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statusText: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});

export default AchievementsScreen;