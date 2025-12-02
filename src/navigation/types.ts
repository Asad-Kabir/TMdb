export type RootStackParamList = {
    Home: undefined;
    MovieDetail: { movieId: number };
    Search: undefined;
    SeatMapping: { movieId: number; movieTitle: string };
    VideoPlayer: { videoKey: string };
  };
  
  // export type BottomTabParamList = {
  //   Dashboard: undefined;
  //   Watch: undefined;
  //   MediaLibrary: undefined;
  //   More: undefined;
  // };