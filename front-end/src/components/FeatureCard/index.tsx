import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof FontAwesome.glyphMap;
  onPress: () => void;
  cardBg?: string;      // background card
  textColor?: string;   // title & subtitle text
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  iconName,
  onPress,
  cardBg = '#FFF',
  textColor = '#333',
}) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FontAwesome name={iconName} size={24} color="#3F83F8" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#B0B0B0" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
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
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default FeatureCard;
