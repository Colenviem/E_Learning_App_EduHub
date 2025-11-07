import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
  loading?: boolean;
  title?: string;
}

export const StartButton = ({ onPress, loading = false, title = 'Bắt đầu ngay' }: Props) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '70%',
    paddingVertical: 16,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', letterSpacing: 1 },
});
