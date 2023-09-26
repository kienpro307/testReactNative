/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
{
  /* <Button title="Go back" onPress={() => navigation.goBack()} /> */
}

import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';

const History: React.FC = ({navigation}: any) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.push('Details')}> go detail</Button>
      <Button onPress={() => navigation.navigate('Home')}> go home</Button>
      <Button onPress={() => navigation.goBack()}> go back</Button>
    </View>
  );
};

export default History;
