/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
{
  /* <Button title="Go back" onPress={() => navigation.goBack()} /> */
}

import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, FlatList, ScrollView} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const isTablet = DeviceInfo.isTablet();

const AddEvents: React.FC = ({navigation}: any) => {
  interface EventData {
    eventName: string;
    players: {
      name: null | string;
      reward: null | string;
      time: null | Timestamp;
    }[];
  }

  // const initialPlayers: Player[] = [];
  // const [players, setPlayers] = useState(initialPlayers);
  const [eventName, setEventName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(-1);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [isDuplicateNameUpdate, setIsDuplicateNameUpdate] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    eventName: '', // Tên sự kiện
    players: [], // Danh sách các item (người chơi)
  });
  const [eventDataList, setEventDataList] = useState<EventData[]>([]);

  const handleAddPlayerName = (name: string) => {
    if (playerName !== '' && !playerNames.includes(name)) {
      setPlayerNames([...playerNames, name]);
      setPlayerName('');
      setIsDuplicateName(false);
    }
    if (playerNames.includes(name)) {
      setIsDuplicateName(true);
    }
  };

  const handleSavePlayerName = (name: string, index: number) => {
    if (name !== '' && !playerNames.includes(name)) {
      const updatedPlayerNames = [...playerNames];
      updatedPlayerNames[index] = name;
      setPlayerNames(updatedPlayerNames);
      setEditingPlayerName('');
      setEditingPlayerIndex(-1);
      setIsDuplicateNameUpdate(false);
    }
    if (name === '') {
      setEditingPlayerName('');
      setEditingPlayerIndex(-1);
      handleDeletePlayerName(index);
    }
    if (playerNames.includes(name)) {
      setIsDuplicateNameUpdate(true);
    }
  };

  const handleEditPlayerName = (name: string, index: number) => {
    setEditingPlayerIndex(index);
    setEditingPlayerName(name);
  };

  const handleDeletePlayerName = (index: number) => {
    // Thực hiện các tác vụ xóa người chơi khỏi danh sách
    setPlayerNames(prevPlayerNames => {
      const updatedPlayerNames = [...prevPlayerNames];
      updatedPlayerNames.splice(index, 1);
      return updatedPlayerNames;
    });
  };

  const handleSubmit = async () => {
    if (eventName !== '' && playerNames.length > 0) {
      const newEventData = {
        eventName: eventName,
        players: playerNames.map(playerName => ({
          name: playerName,
          reward: 'Chưa quay',
          time: null,
        })),
      };
      try {
        const storedEventDataListJson = await AsyncStorage.getItem(
          'eventDataList',
        );
        let eventDataListTemp: EventData[] = [];

        if (storedEventDataListJson) {
          const storedEventDataList = JSON.parse(storedEventDataListJson);

          eventDataListTemp = storedEventDataList;
        }

        eventDataListTemp.push(newEventData);

        await AsyncStorage.setItem(
          'eventDataList',
          JSON.stringify(eventDataListTemp),
        );
        setEventDataList(eventDataListTemp);
        navigation.goBack();
      } catch (err) {
        console.log(err);
      }

      setEventName('');
      setPlayerNames([]);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('eventDataList');
      if (jsonValue !== null) {
        setEventDataList(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Tên sự kiện"
        value={eventName}
        onChangeText={text => setEventName(text)}
        style={styles.text}
      />
      <TextInput
        label="Thêm người chơi"
        value={playerName}
        onChangeText={text => setPlayerName(text)}
        onSubmitEditing={() => handleAddPlayerName(playerName)}
        style={[
          styles.text,
          {borderColor: isDuplicateName ? 'red' : 'initial'},
        ]}
      />
      <HelperText type="error" visible={isDuplicateName}>
        Người chơi này đã tồn tại
      </HelperText>
      <FlatList
        style={styles.listPlayer}
        data={playerNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.playerItem}>
            {index === editingPlayerIndex ? (
              <View style={styles.playerInfoEdit}>
                <TextInput
                  label="Tên người chơi"
                  value={editingPlayerName}
                  onChangeText={text => setEditingPlayerName(text)}
                  onSubmitEditing={() =>
                    handleSavePlayerName(editingPlayerName, index)
                  }
                />
                <HelperText type="error" visible={isDuplicateNameUpdate}>
                  Người chơi này đã tồn tại
                </HelperText>
              </View>
            ) : (
              <View style={styles.playerInfo}>
                <Text style={{fontSize: 15, color: 'black'}}>
                  {index + 1}. {item}
                </Text>
              </View>
            )}

            {index === editingPlayerIndex ? (
              <View style={styles.actionEdit}>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleSavePlayerName(item, index)}>
                  Lưu
                </Button>
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleEditPlayerName(item, index)}>
                  Sửa
                </Button>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleDeletePlayerName(index)}>
                  Xóa
                </Button>
              </View>
            )}
          </View>
        )}
      />

      <Button
        buttonColor="#ff8416"
        mode="contained"
        labelStyle={styles.textButton}
        onPress={() => handleSubmit()}
        style={styles.saveButton}>
        Thêm mới
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('80%'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    width: '90%',
  },
  playerItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  listPlayer: {
    marginTop: 20,
    width: '90%',
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#ff8416',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  playerInfo: {
    flex: 5,
  },
  playerInfoEdit: {
    flex: 8,
    marginRight: 10,
  },
  actions: {
    display: 'flex',
    flex: 5, // Chiếm 1 phần trên tổng số 10 (10%)
    flexDirection: 'row', // Để sắp xếp nút Sửa và Xóa theo hàng ngang
    justifyContent: 'space-between',
  },
  actionEdit: {
    display: 'flex',
    flex: 3, // Chiếm 1 phần trên tổng số 10 (10%)
    flexDirection: 'row', // Để sắp xếp nút Sửa và Xóa theo hàng ngang
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: 30,
    color: 'white',
  },
  textButton: {
    fontSize: 13,
    color: 'white',
  },
});

export default AddEvents;
