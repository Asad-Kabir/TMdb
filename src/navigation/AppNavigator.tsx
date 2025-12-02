import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  HomeScreen,
  MovieDetailScreen,
  SearchScreen,
  SeatMappingScreen,
  VideoPlayerScreen,
} from '@screens/index';
import { RootStackParamList } from './types';

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
        <Stack.Screen
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
          name="VideoPlayer"
          component={VideoPlayerScreen}
        />
        <Stack.Screen name="SeatMapping" component={SeatMappingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
