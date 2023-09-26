/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import { Button } from 'react-native-paper';

const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
      </View>
      <View>
        <Button
          buttonColor="#ff8416"
          mode="contained"
          onPress={() => console.log('Pressed')}>
          something
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff8416',
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderBottomRightRadius: 20,
    // borderBottomLeftRadius: 20,
  },
  logo: {
    width: 110,
    height: 120,
  },
});

export default Header;
