import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  fetchMovieDetails,
  fetchMovieVideos,
  clearMovieDetails,
} from '@store/slices/movieSlice';
import { LoadingSpinner, ErrorView } from '@components/common';
import { IMAGE_BASE_URL } from '@api/client';
import { IMAGE_SIZES } from '@api/endpoints';
import { formatDate } from '@utils/helpers';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const MovieDetailScreen = ({ navigation, route }: Props) => {
  const { movieId } = route.params;
  const dispatch = useAppDispatch();
  const { movieDetails, movieVideos, loading, error } = useAppSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
    dispatch(fetchMovieVideos(movieId));
    return () => dispatch(clearMovieDetails());
  }, [dispatch, movieId]);

  const handleWatchTrailer = () => {
    const trailer = movieVideos.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    if (trailer) {
      navigation.navigate('VideoPlayer', { videoKey: trailer.key });
    }
  };

  const handleGetTickets = () => {
    navigation.navigate('SeatMapping', {
      movieId,
      movieTitle: movieDetails?.title || '',
    });
  };

  if (loading && !movieDetails) return <LoadingSpinner />;
  if (error && !movieDetails)
    return <ErrorView message={error} onRetry={() => dispatch(fetchMovieDetails(movieId))} />;
  if (!movieDetails) return null;

  const backdropUrl = movieDetails.backdrop_path
    ? `${IMAGE_BASE_URL}${IMAGE_SIZES.BACKDROP_LARGE}${movieDetails.backdrop_path}`
    : null;

  const hasTrailer = movieVideos.some(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  // Genre colors exactly like in screenshot
  const genreColors: { [key: string]: string } = {
    Action: '#E0F8F8',
    Thriller: '#E8DAF8',
    Science: '#D8E4F8',
    Fiction: '#F8E8C0',
    Adventure: '#D0F8D0',
    Comedy: '#FFF0D0',
    Drama: '#F8D8D8',
    Horror: '#E0E0E0',
    Crime: '#E0E0E0',
  };

  const getGenreColor = (name: string) => genreColors[name] || '#EEEEEE';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.hero}>
          <ImageBackground
            source={{ uri: backdropUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          >

          {/* Back Button with "Watch" text */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Watch</Text>
          </TouchableOpacity>

        {/* Title & Release Date */}
        <View style={styles.titleSection}>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.getTicketsBtn} onPress={handleGetTickets}>
            <Text style={styles.getTicketsText}>Get Tickets</Text>
          </TouchableOpacity>

          {hasTrailer && (
            <TouchableOpacity style={styles.trailerBtn} onPress={handleWatchTrailer}>
              <Text style={styles.trailerBtnText}>▶ Watch Trailer</Text>
            </TouchableOpacity>
          )}
        </View>
        </ImageBackground>
        </View>

        {/* Genres */}
        <View style={styles.genresSection}>
          <Text style={styles.genresLabel}>Genres</Text>
          <View style={styles.genresRow}>
            {movieDetails.genres?.map((g: any) => (
              <View
                key={g.id}
                style={[styles.genrePill, { backgroundColor: getGenreColor(g.name) }]}
              >
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <Text style={styles.overviewText}>{movieDetails.overview}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { height: 420, position: 'relative', },
  heroImage: {  width: '100%', height: '100%', resizeMode:'contain', justifyContent:'space-between' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backArrow: { color: '#fff', fontSize: 24, marginRight: 4 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  release: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  buttonsContainer: {
    padding: 50,
    marginTop: 24,
    gap: 12,
  },
  getTicketsBtn: {
    backgroundColor: '#00C2FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  getTicketsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trailerBtn: {
    borderWidth: 2,
    borderColor: '#00C2FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  trailerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  genresSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  genresLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genrePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 32,
    paddingBottom: 40,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
});

export default MovieDetailScreen;