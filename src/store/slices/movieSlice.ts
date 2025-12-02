import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '@api/services';

// Types
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MovieState {
  upcomingMovies: Movie[];
  movieDetails: any;
  movieVideos: any[];
  searchResults: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

const initialState: MovieState = {
  upcomingMovies: [],
  movieDetails: null,
  movieVideos: [],
  searchResults: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
};

// Async Thunks
export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcoming',
  async (page: number = 1) => {
    const response = await movieService.getUpcomingMovies(page);
    return response;
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId: number) => {
    const response = await movieService.getMovieDetails(movieId);
    return response;
  }
);

export const fetchMovieVideos = createAsyncThunk(
  'movies/fetchVideos',
  async (movieId: number) => {
    const response = await movieService.getMovieVideos(movieId);
    return response;
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page }: { query: string; page: number }) => {
    const response = await movieService.searchMovies(query, page);
    return response;
  }
);

// Slice
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearMovieDetails: (state) => {
      state.movieDetails = null;
      state.movieVideos = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Upcoming Movies
    builder
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingMovies = action?.payload?.results;
        state.page = action?.payload?.page;
        state.totalPages = action?.payload?.total_pages;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });

    // Fetch Movie Details
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      });

    // Fetch Movie Videos
    builder
      .addCase(fetchMovieVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.movieVideos = action.payload.results;
      })
      .addCase(fetchMovieVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch videos';
      });

    // Search Movies
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { clearMovieDetails, clearSearchResults, resetError } = movieSlice.actions;
export default movieSlice.reducer;