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
import {Button, List} from 'react-native-paper';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const History: React.FC = ({navigation}: any) => {
  interface EventData {
    eventName: string;
    players: {
      name: null | string;
      reward: null | string;
      time: null | Timestamp;
    }[];
  }
  const [eventDataList, setEventDataList] = useState<EventData[]>([]);
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null,
  );
  const isFocused = useIsFocused();

  const handleAccordionToggle = (index: number) => {
    if (selectedAccordion === index) {
      setSelectedAccordion(null); // Nếu đã chọn lại cùng một accordion, đóng nó lại
    } else {
      setSelectedAccordion(index); // Nếu chọn một accordion mới, mở nó ra
    }
  };
  const isAccordionOpen = (index: number) => selectedAccordion === index;

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
      <View style={styles.EventList}>
        <FlatList
          data={eventDataList}
          keyExtractor={(event, eventIndex) => eventIndex.toString()}
          renderItem={({item, index}) => (
            <View style={styles.event}>
              <TouchableOpacity
                style={styles.eventData}
                onPress={() => handleAccordionToggle(index)}>
                <View style={styles.item}>
                  <Text style={styles.eventTitle}> {item.eventName}</Text>
                </View>
              </TouchableOpacity>

              {isAccordionOpen(index) && (
                <View style={styles.playersList}>
                  <FlatList
                    data={item.players}
                    keyExtractor={(player, playerIndex) =>
                      playerIndex.toString()
                    }
                    renderItem={({item, index}) => (
                      <List.Item
                        title={<Text style={styles.title}>{item.name}</Text>}
                        description={
                          <Text style={styles.description}>
                            Phần thưởng: {item.reward || 'N/A'}, Thời gian:{' '}
                            {item.time || 'N/A'}
                          </Text>
                        }
                      />
                    )}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  EventList: {
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    height: hp('70%'),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2, // Độ dày đường kẻ dưới
    borderBottomColor: 'white', // Màu sắc của đường kẻ
  },
  playersList: {
    backgroundColor: 'white',
  },
  playerName: {fontSize: 17, marginBottom: 5, marginLeft: 40},
  eventTitle: {
    fontSize: 20,
    color: 'black',
  },
  event: {
    backgroundColor: 'orange',
  },
  eventData: {},
  button: {},
  textButton: {
    fontSize: 15,
  },
  title: {
    fontSize: 14, 
    fontWeight: 'bold', 
    color: 'black', 
  },
  description: {
    fontSize: 12, 
    color: 'black', 
  },
});

export default History;
