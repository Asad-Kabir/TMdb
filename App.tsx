/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, } from 'react-native';
import { SafeAreaProvider, } from 'react-native-safe-area-context';

import { FONTS, FONT_SIZES } from '@styles/typography';
import AppNavigator from '@navigation/AppNavigator';
import { movieService } from '@api/services';
import { COLORS } from '@styles/colors';
import { Provider } from 'react-redux';
import { store } from '@store/index';

const App = () => {

  // useEffect(() => {
  //   const testAPI = async () => {
  //     try {
  //       const data = await movieService.getUpcomingMovies();
  //       console.log('Movies:', JSON.stringify(data, null, 2));
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  //   testAPI();
  // }, []);

  return (
    <Provider store={store}>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <AppNavigator />
    </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    marginBottom: 20,
  },
  colorBox: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  colorText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
});

export default App;
