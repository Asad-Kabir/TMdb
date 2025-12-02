export const ENDPOINTS = {
    UPCOMING_MOVIES: '/movie/upcoming',
    MOVIE_DETAILS: (movieId) => `/movie/${movieId}`,
    MOVIE_IMAGES: (movieId) => `/movie/${movieId}/images`,
    MOVIE_VIDEOS: (movieId) => `/movie/${movieId}/videos`,
    SEARCH_MOVIES: '/search/movie',
  };
  
  export const IMAGE_SIZES = {
    POSTER_SMALL: '/w185',
    POSTER_MEDIUM: '/w342',
    POSTER_LARGE: '/w500',
    BACKDROP_SMALL: '/w300',
    BACKDROP_MEDIUM: '/w780',
    BACKDROP_LARGE: '/w1280',
    ORIGINAL: '/original',
  };