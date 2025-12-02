import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export const movieService = {
  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await apiClient.get(ENDPOINTS.UPCOMING_MOVIES, {
        params: { page },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.MOVIE_DETAILS(movieId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get movie images
  getMovieImages: async (movieId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.MOVIE_IMAGES(movieId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.MOVIE_VIDEOS(movieId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH_MOVIES, {
        params: { query, page },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};