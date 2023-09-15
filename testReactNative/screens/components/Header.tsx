/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
      </View>
      <View>
        <Text>Button</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9be00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  logo: {
    width: 110,
    height: 120,
  },
});

export default Header;
