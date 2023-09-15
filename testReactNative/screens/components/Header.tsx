/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text,View} from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View>
        <Text>Logo</Text>
      </View>
      <View>
        <Text>Button</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
}
)

export default Header;
