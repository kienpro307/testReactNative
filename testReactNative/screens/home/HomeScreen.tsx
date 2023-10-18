/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LuckyDraw4 from '../components/LuckyDraw4';

const HomeScreen: React.FC = ({route, navigation}: any) => {
  const {index} = route.params ? route.params : -1;
  return (
    <View style={styles.screen}>
      <LuckyDraw4 index={index} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffbc00',
    height: '100%',
    flex: 1,
  },
});

export default HomeScreen;
