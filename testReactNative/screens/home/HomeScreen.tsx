/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LuckyDraw3 from '../components/LuckyDraw3';
import Header from '../components/Header';
const HomeScreen: React.FC = ({navigation}: any) => {
  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.container}>
        <LuckyDraw3 navigation={navigation} />
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
