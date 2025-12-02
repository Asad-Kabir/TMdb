import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { searchMovies, clearSearchResults } from '@store/slices/movieSlice';
import { LoadingSpinner } from '@components/common';
import { IMAGE_BASE_URL } from '@api/client';
import { IMAGE_SIZES } from '@api/endpoints';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

// Genre categories with images (placeholder URLs)
const GENRE_CATEGORIES = [
  { id: 1, name: 'Comedies', image: 'https://via.placeholder.com/150x200/FF6B6B/fff?text=Comedies' },
  { id: 2, name: 'Crime', image: 'https://via.placeholder.com/150x200/4ECDC4/fff?text=Crime' },
  { id: 3, name: 'Family', image: 'https://via.placeholder.com/150x200/45B7D1/fff?text=Family' },
  { id: 4, name: 'Documentaries', image: 'https://via.placeholder.com/150x200/96CEB4/fff?text=Docs' },
  { id: 5, name: 'Dramas', image: 'https://via.placeholder.com/150x200/FFEAA7/fff?text=Dramas' },
  { id: 6, name: 'Fantasy', image: 'https://via.placeholder.com/150x200/DFE6E9/fff?text=Fantasy' },
  { id: 7, name: 'Holidays', image: 'https://via.placeholder.com/150x200/74B9FF/fff?text=Holidays' },
  { id: 8, name: 'Horror', image: 'https://via.placeholder.com/150x200/A29BFE/fff?text=Horror' },
  { id: 9, name: 'Sci-Fi', image: 'https://via.placeholder.com/150x200/FD79A8/fff?text=Sci-Fi' },
  { id: 10, name: 'Thriller', image: 'https://via.placeholder.com/150x200/636E72/fff?text=Thriller' },
];

const SearchScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useAppDispatch();
  const { searchResults, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        dispatch(searchMovies({ query: searchQuery, page: 1 }));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      dispatch(clearSearchResults());
    }
  }, [searchQuery, dispatch]);

  const handleClear = () => {
    setSearchQuery('');
    setIsSearching(false);
    dispatch(clearSearchResults());
  };

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  // Initial State - Genre Categories
  const renderGenreCategories = () => (
    <View style={styles.genreContainer}>
      {GENRE_CATEGORIES.map((genre) => (
        <TouchableOpacity key={genre.id} style={styles.genreCard} activeOpacity={0.8}>
          <Image source={{ uri: genre.image }} style={styles.genreImage} />
          <View style={styles.genreOverlay}>
            <Text style={styles.genreName}>{genre.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Search Results - Top Results (when typing)
  const renderSearchResults = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (searchResults.length === 0 && searchQuery.trim().length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.resultsTitle}>
            {searchResults.length} Results Found
          </Text>
        </View>

        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleMoviePress(item.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: item.poster_path
                    ? `${IMAGE_BASE_URL}${IMAGE_SIZES.POSTER_SMALL}${item.poster_path}`
                    : 'https://via.placeholder.com/120x180/CCCCCC/666666?text=No+Image',
                }}
                style={styles.resultImage}
              />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.resultGenre}>
                  {item.genre_ids?.slice(0, 2).join(', ') || 'Movie'}
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreIcon}>...</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        {searchResults.length === 0 &&(
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="TV shows, movies and more"
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        )}
      </View>

      {/* Content */}
      {searchResults.length > 0 ? (
        renderSearchResults()
      ) : isSearching && searchQuery.trim().length > 0 ? (
        <View>
          <Text style={styles.topResultsTitle}>Top Results</Text>
          {renderSearchResults()}
        </View>
      ) : (
        renderGenreCategories()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    marginTop:30
  },
  headerBackButton: {
    marginRight: 12,
  },
  backButton: {
    fontSize: 28,
    color: COLORS.secondary,
    fontFamily: FONTS.bold,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.gray,
  },
  topResultsTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  genreCard: {
    width: (width - 40) / 2,
    height: 100,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  genreImage: {
    width: '100%',
    height: '100%',
  },
  genreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  resultsTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    marginLeft: 16,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  resultTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    marginBottom: 6,
  },
  resultGenre: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 32,
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
});

export default SearchScreen;