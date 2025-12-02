import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';
import { IMAGE_BASE_URL } from '@api/client';
import { IMAGE_SIZES } from '@api/endpoints';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with 16px padding

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  onPress: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, posterPath, onPress }) => {
  const imageUrl = posterPath
    ? `${IMAGE_BASE_URL}${IMAGE_SIZES.POSTER_MEDIUM}${posterPath}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: COLORS.lightGray,
  },
  titleContainer: {
    padding: 12,
    minHeight: 60,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
  },
});

export default MovieCard;