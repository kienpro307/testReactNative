/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const isTablet = DeviceInfo.isTablet();

const UpdateEvent: React.FC = ({route, navigation}: any) => {
  const {index} = route.params;

  interface EventData {
    eventName: string;
    players: {
      name: null | string;
      reward: null | string;
      time: null | Timestamp;
    }[];
  }

  const [eventName, setEventName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(-1);
  const [editingPlayerIndex2, setEditingPlayerIndex2] = useState(-1);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [isDuplicateNameUpdate, setIsDuplicateNameUpdate] = useState(false);
  const [isEditAble, setIsEditAble] = useState(true);
  const isFocused = useIsFocused();
  const [eventData, setEventData] = useState<EventData>({
    eventName: '',
    players: [],
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
    setEditingPlayerIndex2(index);

    if (
      eventData.players[index] &&
      (eventData.players[index].reward !== null ||
        eventData.players[index].reward !== 'Chưa quay')
    ) {
      setIsEditAble(false);
    } else {
      setEditingPlayerIndex(index);
      setEditingPlayerName(name);
      setIsEditAble(true);
    }
  };

  const handleDeletePlayerName = (index: number) => {
    // Thực hiện các tác vụ xóa người chơi khỏi danh sách
    setPlayerNames(prevPlayerNames => {
      const updatedPlayerNames = [...prevPlayerNames];
      updatedPlayerNames.splice(index, 1);
      return updatedPlayerNames;
    });
  };

  const handleUpdateEvent = async () => {
    if (eventName !== '' && playerNames.length > 0) {
      const allPlayers = eventDataList.flatMap(event => event.players);

      const updatedEvent = {
        eventName: eventName,
        players: playerNames.map(playerName => ({
          name: playerName,
          reward: null, // Khởi tạo reward và time tại đây
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

        if (index >= 0 && index < eventDataListTemp.length) {
          const existingPlayerNames = eventDataListTemp[index].players.map(
            player => player.name,
          );
          const newPlayers = updatedEvent.players.filter(
            player => !existingPlayerNames.includes(player.name),
          );
          eventDataListTemp[index].eventName = eventName;
          eventDataListTemp[index].players =
            eventDataListTemp[index].players.concat(newPlayers);
          await AsyncStorage.setItem(
            'eventDataList',
            JSON.stringify(eventDataListTemp),
          );
          setEventDataList(eventDataListTemp);
          navigation.goBack();
        } else {
          console.log('Index không hợp lệ');
        }
      } catch (err) {
        console.log(err);
      }

      setEventName('');
      setPlayerNames([]);
    }
  };

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('eventDataList');
      if (jsonValue !== null) {
        const loadedEventDataList = JSON.parse(jsonValue);
        setEventDataList(loadedEventDataList);

        if (index >= 0 && index < loadedEventDataList.length) {
          const event = loadedEventDataList[index];
          setEventData(event);
          const playerUpdateNames = event.players
            .map((player: {name: any}) => player.name)
            .filter((name: null) => name !== null) as string[];
          const eventUpdateName = event.eventName;
          setPlayerNames(playerUpdateNames);
          setEventName(eventUpdateName);
        } else {
          console.log('Index không hợp lệ');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [isFocused]);

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
          <View style={styles.playerItemContainer}>
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
                    onPress={() =>
                      handleSavePlayerName(editingPlayerName, index)
                    }>
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
            {!isEditAble && index === editingPlayerIndex2 && (
              <HelperText
                type="error"
                visible={!isEditAble && index === editingPlayerIndex2}>
                Không thể sửa người chơi đã có phần thưởng
              </HelperText>
            )}
          </View>
        )}
      />

      <Button
        buttonColor="#ff8416"
        mode="contained"
        onPress={() => handleUpdateEvent()}
        labelStyle={styles.textButton}
        style={styles.saveButton}>
        Lưu
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
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  playerItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
  },
  playerItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    flex: isTablet ? 9 : 6,
  },
  playerInfoEdit: {
    flex: isTablet ? 9 : 8,
    marginRight: 10,
  },

  actions: {
    display: 'flex',
    flex: isTablet ? 2 : 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionEdit: {
    display: 'flex',
    flex: isTablet ? 1 : 3,
    flexDirection: 'row',
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

export default UpdateEvent;
