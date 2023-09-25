/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import LuckyDraw2 from '../components/LuckyDraw2';
const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.container}>
        <LuckyDraw2 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    backgroundColor: '#ffcd2a',
    height: '100%',
  },
});

export default HomeScreen;
