import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUpcomingMovies } from '@store/slices/movieSlice';
import { MovieCard, LoadingSpinner, ErrorView } from '@components/common';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { upcomingMovies, loading, error } = useAppSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchUpcomingMovies(1));
  }, [dispatch]);

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  const handleRetry = () => {
    dispatch(fetchUpcomingMovies(1));
  };

  if (loading && upcomingMovies.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && upcomingMovies.length === 0) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watch</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={upcomingMovies}
        keyExtractor={(item) => item.id.toString()}
        // numColumns={2}
        contentContainerStyle={styles.listContent}
        // columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MovieCard
            id={item?.id}
            title={item.title}
            posterPath={item.poster_path}
            onPress={() => handleMoviePress(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  searchIcon: {
    fontSize: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;