/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
{
  /* <Button title="Go back" onPress={() => navigation.goBack()} /> */
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button, Dialog, List} from 'react-native-paper';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {setIndexEvent} from '../store/dataSlice';
import {useDispatch} from 'react-redux';

const isTablet = DeviceInfo.isTablet();

const SelectEvent: React.FC = ({navigation}: any) => {
  interface EventData {
    eventName: string;
    players: {
      name: null | string;
      reward: null | string;
      time: null | Timestamp;
    }[];
  }
  const dispatch = useDispatch();
  const [eventDataList, setEventDataList] = useState<EventData[]>([]);
  const isFocused = useIsFocused();
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null,
  );
  const [visible, setVisible] = React.useState(false);
  const [eventDelete, setEventDelete] = useState<number>(-1);
  const hideDialog = () => setVisible(false);
  const handleAccordionToggle = (index: number) => {
    if (selectedAccordion === index) {
      setSelectedAccordion(null); // Nếu đã chọn lại cùng một accordion, đóng nó lại
    } else {
      setSelectedAccordion(index); // Nếu chọn một accordion mới, mở nó ra
    }
  };

  const isAccordionOpen = (index: number) => selectedAccordion === index;

  const handleEventSelection = (index: number) => {
    dispatch(setIndexEvent(index));
    navigation.navigate('Home');
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEventDataList = eventDataList.filter((_, i) => i !== index);
    setEventDataList(updatedEventDataList);
    saveData(updatedEventDataList);
    setVisible(false);
  };

  const saveData = async (updatedEventDataList: EventData[]) => {
    try {
      const jsonData = JSON.stringify(updatedEventDataList);
      await AsyncStorage.setItem('eventDataList', jsonData);
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          style={styles.button}
          buttonColor="#ff8416"
          mode="contained"
          onPress={() => navigation.navigate('AddEvents')}
          labelStyle={styles.textButton}>
          Thêm sự kiện
        </Button>
      </View>
      <View style={styles.EventList}>
        <FlatList
          data={eventDataList}
          keyExtractor={(event, eventIndex) => eventIndex.toString()}
          renderItem={({item, index}) => (
            <View style={styles.event}>
              <View style={styles.item}>
                <TouchableOpacity
                  style={styles.eventData}
                  onPress={() => handleAccordionToggle(index)}>
                  <Text style={styles.eventTitle}>{item.eventName}</Text>
                </TouchableOpacity>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => handleEventSelection(index)}
                  labelStyle={styles.textButton}>
                  Chọn
                </Button>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() =>
                    navigation.navigate('UpdateEvent', {index: index})
                  }
                  labelStyle={styles.textButton}>
                  Sửa
                </Button>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => [setVisible(true), setEventDelete(index)]}
                  labelStyle={styles.textButton}>
                  Xóa
                </Button>
              </View>

              {isAccordionOpen(index) && (
                <View style={styles.playersList}>
                  <FlatList
                    data={item.players}
                    keyExtractor={(player, playerIndex) =>
                      playerIndex.toString()
                    }
                    renderItem={({item, index}) => (
                      <Text style={styles.playerName}>{item.name}</Text>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
      <Dialog visible={visible} onDismiss={hideDialog} style={{zIndex: 10}}>
        <Dialog.Title>Bạn có chắc muốn xóa sự kiện không</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={() => handleDeleteEvent(eventDelete)}>Đồng ý</Button>
          <Button onPress={() => setVisible(false)}>Hủy</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: isTablet ? 'space-between' : 'center',
    paddingVertical: 10,
    borderBottomWidth: 2, // Độ dày đường kẻ dưới
    borderBottomColor: 'white', // Màu sắc của đường kẻ
  },
  header: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  playersList: {
    backgroundColor: 'white',
  },
  playerName: {
    fontSize: 17,
    marginBottom: 5,
    color: 'black',
    paddingLeft: isTablet ? 40 : 40,
  },
  eventTitle: {
    fontSize: 20,
    paddingLeft: isTablet ? 60 : 10,
    paddingTop: 5,
    color: 'black',
  },
  EventList: {
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    height: hp('70%'),
  },
  event: {
    backgroundColor: 'orange',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  eventData: {
    width: 150,
    height: '100%',
    flex: isTablet ? 15 : 1,
  },
  button: {},
  buttonAction: {
    flex: isTablet ? 1 : 0,
    marginHorizontal: 5,
  },
  textButton: {
    fontSize: 13,
    color: 'white',
  },
});

export default SelectEvent;
