/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
{
  /* <Button title="Go back" onPress={() => navigation.goBack()} /> */
}

import React, {useState} from 'react';
import {Text, StyleSheet, View, FlatList} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

interface Player {
  eventNumber: number;
  // eventName: string,
  name: string;
  reward: string;
  time: Timestamp;
}

const Events: React.FC = ({navigation}: any) => {
  const initialPlayers: Player[] = [];
  const [players, setPlayers] = useState(initialPlayers);
  const [eventName, setEventName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const handleAddPlayerName = (name: string) => {
    setPlayerNames([...playerNames, name]);
  };

  const handleEditPlayerName = (name: string) => {
    // Thực hiện các tác vụ sửa thông tin người chơi
    // Ví dụ: navigation.navigate('EditPlayer', { player });
  };

  const handleDeletePlayerName = (name: string) => {
    // Thực hiện các tác vụ xóa người chơi khỏi danh sách
    setPlayerNames(playerNames.filter(p => p !== name));
  };

  const handleSubmit = () => {};

  console.log(playerNames);

  return (
    <View style={styles.container}>
      <TextInput
        label="Tên event"
        value={eventName}
        onChangeText={text => setEventName(text)}
        style={styles.text}
      />
      <TextInput
        label="Thêm người chơi"
        value={playerName}
        onChangeText={text => setPlayerName(text)}
        onSubmitEditing={() => handleAddPlayerName(playerName)}
        style={styles.text}
      />
      <View style={styles.listPlayer}>
        <FlatList
          style={{width: '100%'}}
          data={playerNames}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.playerItem}>
              <View style={{marginRight: 150, marginLeft: 10}}>
                <Text>{item}</Text>
              </View>

              <View style={{marginRight: 10}}>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => handleEditPlayerName(item)}>
                  Sửa
                </Button>
              </View>
              <View>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => handleDeletePlayerName(item)}>
                  Xóa
                </Button>
              </View>
            </View>
          )}
        />
      </View>

      <Button
        buttonColor="#ff8416"
        mode="contained"
        onPress={() => handleSubmit()}>
        Lưu
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    width: '90%',
  },
  playerItem: {
    marginVertical: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPlayer: {
    width: '90%',
  },
});

export default Events;
