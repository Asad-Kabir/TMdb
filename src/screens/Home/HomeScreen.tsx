import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie List Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MovieDetail', { movieId: 123 })}
      >
        <Text style={styles.buttonText}>Go to Movie Detail</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.buttonText}>Go to Search</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default HomeScreen;