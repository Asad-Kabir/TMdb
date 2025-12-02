import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import COLORS from '@styles/colors';
import FONTS, { FONT_SIZES } from '@styles/typography';

const SearchScreen = ({}) => {
  return (
<View style={styles.container}>
      <Text style={styles.title}>Movie Detail Screen</Text>
      {/* <Text style={styles.subtitle}>Movie ID: {movieId}</Text> */}
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('SeatMapping', { movieId, movieTitle: 'Test Movie' })}
      >
        <Text style={styles.buttonText}>Book Tickets</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
});
