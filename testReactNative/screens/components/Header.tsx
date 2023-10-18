/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text> header</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: '#ff7486',
    marginTop: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderBottomRightRadius: 20,
    // borderBottomLeftRadius: 20,
  },
  actions: {
    flex: 1,
  },
  button: {
    marginBottom: 10,
    marginLeft: 7,
    flex: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textButton: {
    fontSize: 15,
  },
});

export default Header;
