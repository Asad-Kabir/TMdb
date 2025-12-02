import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Screens (abhi dummy import, baad mein real screens add karenge)
import {HomeScreen, MovieDetailScreen, SearchScreen} from '@screens/index';
// import MovieDetailScreen from '@screens/MovieDetail/MovieDetailScreen';
// import SearchScreen from '@screens/Search/SearchScreen';
// import SeatMappingScreen from '@screens/SeatMapping/SeatMappingScreen';
// import VideoPlayerScreen from '@screens/VideoPlayer/VideoPlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        {/* <Stack.Screen name="SeatMapping" component={SeatMappingScreen} />
        <Stack.Screen 
          name="VideoPlayer" 
          component={VideoPlayerScreen}
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;