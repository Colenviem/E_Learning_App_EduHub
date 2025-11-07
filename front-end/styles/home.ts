import { FlatList, TextInput } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  height: 100%;
  background-color: #6548a3;
`;

export const Header = styled.View`
  padding: 0 24px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`;

export const SearchTextInput = styled(TextInput)`
  height: 56px;
  width: 100%;
  border-radius: 100px;
  background-color: #fff;
  margin-bottom: 20px;
`;

export const Content = styled.View`
  background-color: #f0edf5;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  height: 100%;
`;

export const ContentHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 24px;
`;

export const ScrollView = styled(FlatList as new () => FlatList)`
  flex: 1;
  margin-bottom: 220px;
  padding-left: 33px;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 20px;
  color: #3d3d4c;
  margin: 24px 0;
`;

export const HeaderText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 15px;
  color: #a0a0b2;
  margin: 24px 0;
`;

import { Dimensions, StyleSheet } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;
export const COURSE_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export const styles = StyleSheet.create({
  // Container chính
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
  },

  // Header
  headerContainer: {
    backgroundColor: '#1A1A1A',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  iconButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A78BFA',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#333', padding: 0 },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Scroll content
  scrollContent: { paddingBottom: 100 },

  // Carousel
  carouselContainer: { marginVertical: 20, paddingHorizontal: 16 },
  bannerWrapper: {
    width: CAROUSEL_WIDTH,
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', top: 12, left: 12 },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerBadgeText: { fontSize: 11, fontWeight: '700', color: '#A78BFA' },

  // Categories
  categoriesSection: { marginBottom: 20 },
  categoriesList: { paddingHorizontal: 16, gap: 8 },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  categoryButtonActive: { 
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
    shadowColor: '#A78BFA',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryText: { color: '#A78BFA', fontWeight: '700', fontSize: 13 },
  categoryTextActive: { color: '#FFFFFF' },

  // Section
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.2 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText: { color: '#A78BFA', fontWeight: '700', fontSize: 13 },

  // Progress cards
  progressList: { paddingHorizontal: 18 },
  progressCard: {
    width: SCREEN_WIDTH * 0.65,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  progressImageContainer: { width: '100%', height: 120, position: 'relative' },
  progressImage: { width: '100%', height: '100%' },
  progressOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressInfo: { padding: 14 },
  progressCourseName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 10, lineHeight: 20 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBarBackground: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#A78BFA', borderRadius: 3 },
  progressPercentage: { fontSize: 13, fontWeight: '800', color: '#A78BFA', minWidth: 36, textAlign: 'right' },

  // Grid courses
  coursesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 18, gap: 14 },
  courseCardWrapper: { width: COURSE_CARD_WIDTH },

  // Empty state
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#666', marginBottom: 6 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 13, lineHeight: 18 },
});
