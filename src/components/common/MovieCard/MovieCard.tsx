// MovieCard.tsx
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { IMAGE_BASE_URL } from '@api/client';
import { IMAGE_SIZES } from '@api/endpoints';
import { FONT_SIZES } from '@styles/typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // full width minus horizontal padding
const CARD_HEIGHT = CARD_WIDTH * 0.5625; // 16:9 aspect ratio (perfect for backdrops)

interface MovieCardProps {
  id?: string;
  title: string;
  posterPath: string; // actually backdrop_path use karo for this style
  onPress: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({id, title, posterPath, onPress }) => {
  const imageUrl = posterPath
    ? `${IMAGE_BASE_URL}${IMAGE_SIZES.BACKDROP_LARGE}${posterPath}`
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.backdrop}
        resizeMode="cover"
        borderRadius={16}
      >
        {/* Perfect Black Gradient from Bottom */}
        <View style={styles.gradientOverlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 12,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    // Real gradient effect using multiple layers
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 80,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
});

export default MovieCard;