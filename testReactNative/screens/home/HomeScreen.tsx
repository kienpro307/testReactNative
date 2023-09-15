/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';
import LuckyDraw from '../components/LuckyDraw';
const HomeScreen = () => {
  return (
    <View>
      <Header />
      <View style={styles.container}>
        <Text>Màn hình home</Text>
        <LuckyDraw />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
});

export default HomeScreen;
