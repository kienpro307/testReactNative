/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import Svg, {G, Path, Text as SvgText, SvgUri, TSpan} from 'react-native-svg';
import Sound from 'react-native-sound';
import {Button, List} from 'react-native-paper';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../types';

interface Player {
  eventNumber: number;
  // eventName: string[],
  name: string;
  reward: string;
  time: Timestamp;
}

const isTablet = DeviceInfo.isTablet();
const rotateTime = 8;
const widthLabelRewardDevide = 2.3;
const heightLabelRewardDevide = 12;

const containerWheelSize = isTablet ? wp('30%') : wp('80%');

const LuckyDraw4: React.FC<{
  navigation: any;
}> = ({navigation}) => {
  const {indexEvent, indexWheel} = useSelector(
    (state: {data: AppState}) => state.data,
  );

  interface WheelData {
    wheelName: string;
    slices: string[];
    colors: string[];
  }

  interface EventData {
    eventName: string;
    players: {
      name: null | string;
      reward: null | string;
      time: null | Timestamp;
    }[];
  }
  const isFocused = useIsFocused();
  const [slices, setSlices] = useState<string[]>(['', '']);
  const [colors, setColors] = useState<string[]>(['#ffbc00', '#ffbc00']);
  const flatListRef = useRef<FlatList<any> | null>(null);
  const initialPlayers: Player[] = [];
  const [players, setPlayers] = useState(initialPlayers);
  const [totalRotate, setTotalRotate] = useState(0);
  const [isSpinEnabled, setIsSpinEnabled] = useState(true);
  const [selected, setSelected] = useState<string>('');
  const [unrewardedList, setUnrewardedList] = useState<number[]>([]);
  const [indexPlayer, setIndexPlayer] = useState<number>(-1);
  const [currentPerson, setCurrentPerson] = useState(-1);
  const [nextPerson, setNextPerson] = useState(-1);
  const [percentEach, setPercentEach] = useState(1);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [historyList, setHistoryList] = useState<any>([]);
  const [eventData, setEventData] = useState<EventData>({
    eventName: '',
    players: [],
  });
  const [wheelData, setWheelData] = useState<WheelData>({
    wheelName: '',
    slices: [],
    colors: [],
  });
  const sounds: (Sound | null)[] = [null, null];
  const audioList = [
    {
      title: 'Play xoSo',
      isRequire: true,
      url: require('../../assets/sound/xoSo1.mp3'),
    },
    {
      title: 'Play congratulation',
      isRequire: true,
      url: require('../../assets/sound/congratulation.mp3'),
    },
  ];

  function playSound(index: number) {
    const audioItem = audioList[index];
    sounds[index] = new Sound(audioItem.url, (error: string | null) => {
      if (error !== null) {
        console.log(`Lỗi khi tạo âm thanh ${index}:`, error);
        return;
      }
      sounds[index]?.play(success => {
        if (success) {
          sounds[index]?.release();
        } else {
          console.log(`Lỗi khi phát âm thanh ${index}`);
        }
      });
    });
  }

  const [hasRunEffect, setHasRunEffect] = useState(false);
  useEffect(() => {
    if (!hasRunEffect) {
      playSound(0);
      const interval = setInterval(() => {
        playSound(0);
      }, 188 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
    setHasRunEffect(true);
  }, [hasRunEffect]);

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg'],
  });

  const handleSpinClick = () => {
    if (!isSpinEnabled) {
      return;
    }

    setIsSpinEnabled(false);

    if (
      indexPlayer === unrewardedList.length - 1 &&
      unrewardedList.length > 0
    ) {
      loadNextPlayer();
      setSelected('');
    }
    if (indexPlayer < unrewardedList.length - 1 && unrewardedList.length > 0) {
      loadNextPlayer();

      let value =
        Math.round(Math.random() * 150 + 10) * (percentEach / 10) +
        30 * (percentEach / 10) * slices.length;
      // let value = percentEach / 10;
      if (Number.isInteger(totalRotate / (percentEach / 10))) {
        value += percentEach / 20;
      } else if (
        !Number.isInteger(
          (totalRotate + value - percentEach / 20) / (percentEach / 10),
        )
      ) {
        value =
          Math.round(
            (totalRotate - percentEach / 20 + value) / (percentEach / 10),
          ) *
            (percentEach / 10) +
          percentEach / 20 -
          totalRotate;
      }

      setTotalRotate(totalRotate + value);
      Animated.timing(animatedValue, {
        toValue: totalRotate + value,
        duration: rotateTime * 1000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }).start();

      setSelected('');

      setTimeout(() => {
        playSound(1);
        const reward = choosenValue(totalRotate + value);
        if (indexEvent !== null) {
          setSelected(reward);
          updateReward(indexEvent, unrewardedList[indexPlayer + 1], reward);
          setIsSpinEnabled(true);
        }
        setIsSpinEnabled(true);
      }, rotateTime * 1000);
    }
  };

  const updateReward = async (
    eventIndex: number,
    playerIndex: number,
    reward: string,
  ) => {
    try {
      const jsonValue = await AsyncStorage.getItem('eventDataList');
      if (jsonValue !== null) {
        const eventDataList = JSON.parse(jsonValue);

        if (eventIndex >= 0 && eventIndex < eventDataList.length) {
          const event = eventDataList[eventIndex];
          if (playerIndex >= 0 && playerIndex < event.players.length) {
            event.players[playerIndex].reward = reward;
            const currentTime = new Date();
            const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()} ${currentTime.getDate()}/${
              currentTime.getMonth() + 1
            }/${currentTime.getFullYear()}`;
            event.players[playerIndex].time = formattedTime;

            eventDataList[eventIndex] = event;
            await AsyncStorage.setItem(
              'eventDataList',
              JSON.stringify(eventDataList),
            );
            updateHistoryList(event);
            setEventData(event);
          } else {
            console.log('Index người chơi không hợp lệ');
          }
        } else {
          console.log('Index sự kiện không hợp lệ');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const choosenValue = (rotated: number) => {
    const percent = (rotated * 1000) % 100;
    const index =
      Math.floor((percent + percentEach * 50 + 0.14) / (percentEach * 100)) %
      slices.length;
    return slices[index];
  };

  function getCoordinatesForPercent(percent: number): [number, number] {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  function slice(slices: string[], colors: string[]) {
    let cumulativePercent = 0;
    return slices.map((slice, index) => {
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += percentEach;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      const xLabel = (startX + endX) / 2;
      const yLabel = (startY + endY) / 2;

      const angleLabel = cumulativePercent - percentEach / 2;
      const largeArcFlag = percentEach > 0.5 ? 1 : 0;
      const pathData = [
        `M ${startX} ${startY}`, // Move
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
        'L 0 0', // Line
      ].join(' ');

      return (
        <G key={pathData}>
          <Path d={pathData} fill={colors[index]} />
        </G>
      );
    });
  }

  const getLabelRotate = (index: number) => {
    const rotateAngle = 90 - (index * percentEach - percentEach / 2) * 360;
    return `${rotateAngle}deg`;
  };

  const getLeftLabel = (index: number) => {
    const rotateAngle = 90 - (index * percentEach - percentEach / 2) * 360;
    return (
      (containerWheelSize / 4) * (2 - Math.cos((rotateAngle * Math.PI) / 180)) -
      containerWheelSize / widthLabelRewardDevide / 2
    );
  };

  const getTopLabel = (index: number) => {
    const rotateAngle = 90 - (index * percentEach - percentEach / 2) * 360;
    return (
      (containerWheelSize / 4) * (2 - Math.sin((rotateAngle * Math.PI) / 180)) -
      containerWheelSize / heightLabelRewardDevide / 2
    );
  };

  const addPlayer = (
    eventNumber: number,
    name: string,
    reward: string,
    time: Timestamp,
  ) => {
    const newPlayer: Player = {
      eventNumber: eventNumber,
      name: name,
      reward: reward,
      time: time,
    };

    setPlayers([...players, newPlayer]);
  };

  const findAllUnrewardedPlayers = (eventData: EventData) => {
    const unrewardedPlayers = eventData.players.filter(
      player => player.reward === null || player.reward === 'Chưa quay',
    );

    const unrewardedPlayerIndexes = unrewardedPlayers.map(player =>
      eventData.players.indexOf(player),
    );
    setUnrewardedList(unrewardedPlayerIndexes);
  };

  const updateHistoryList = (eventData: EventData) => {
    const rewardedPlayers = eventData.players.filter(
      player => player.reward !== null && player.reward !== 'Chưa quay',
    );
    setHistoryList(rewardedPlayers);
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };

  const loadNextPlayer = () => {
    var currentIndex = indexPlayer + 1;
    var nextIndex = indexPlayer + 2;
    setIndexPlayer(indexPlayer + 1);
    if (currentIndex < unrewardedList.length) {
      setCurrentPerson(unrewardedList[currentIndex]);
      if (nextIndex >= unrewardedList.length) {
        setNextPerson(-1);
      } else {
        setNextPerson(unrewardedList[nextIndex]);
      }
    } else {
      setCurrentPerson(-1);
    }
  };

  const loadData = async () => {
    try {
      const jsonEventValue = await AsyncStorage.getItem('eventDataList');
      const jsonWheelValue = await AsyncStorage.getItem('wheelDataList');
      if (jsonEventValue !== null) {
        const loadedEventDataList = JSON.parse(jsonEventValue);

        if (
          indexEvent !== null &&
          indexEvent >= 0 &&
          indexEvent < loadedEventDataList.length
        ) {
          const event = loadedEventDataList[indexEvent];
          setEventData(event);
          updateHistoryList(event);
          findAllUnrewardedPlayers(event);
        }
      }

      if (jsonWheelValue !== null) {
        const loadedWheelDataList = JSON.parse(jsonWheelValue);

        if (
          indexWheel !== null &&
          indexWheel >= 0 &&
          indexWheel < loadedWheelDataList.length
        ) {
          const wheel = loadedWheelDataList[indexWheel];
          setWheelData(wheel);
          setSlices(wheel.slices);
          setColors(wheel.colors);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const refreshData = () => {
    setIndexPlayer(-1);
    setSelected('');
    setPercentEach(1 / slices.length);
  };

  useEffect(() => {
    setIsSpinEnabled(true);
    loadData();
    refreshData();
  }, [isFocused, slices.length]);

  useEffect(() => {
    setCurrentPerson(unrewardedList[0]);
    setNextPerson(unrewardedList[1]);
  }, [unrewardedList]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <View style={styles.actionRow}>
          <Button
            style={styles.button}
            buttonColor="#ff8416"
            mode="contained"
            onPress={() => navigation.navigate('Guide')}
            labelStyle={styles.textButton}>
            Hướng dẫn
          </Button>
          <Button
            style={styles.button}
            buttonColor="#ff8416"
            mode="contained"
            onPress={() => navigation.navigate('History')}
            labelStyle={styles.textButton}>
            Lịch sử
          </Button>
        </View>
        <View style={styles.actionRow}>
          <Button
            style={styles.button}
            buttonColor="#ff8416"
            mode="contained"
            onPress={() => navigation.navigate('SelectWheels')}
            labelStyle={styles.textButton}>
            Vòng quay
          </Button>

          <Button
            style={styles.button}
            buttonColor="#ff8416"
            mode="contained"
            onPress={() => navigation.navigate('SelectEvent')}
            labelStyle={styles.textButton}>
            Người chơi
          </Button>
        </View>
      </View>
      <View style={styles.containerTablet}>
        <View style={styles.container}>
          <View style={styles.headerName}>
            <Text style={styles.headerText}>
              {wheelData.wheelName
                ? 'Vòng quay: ' + wheelData.wheelName
                : 'Vui lòng chọn vòng quay'}
            </Text>
            <Text style={styles.headerText}>
              {eventData.eventName
                ? 'Sự kiện: ' + eventData.eventName
                : 'Vui lòng chọn sự kiện'}
            </Text>
          </View>
          <View style={styles.option}></View>
          <View style={styles.containerWheel}>
            <TouchableOpacity onPress={handleSpinClick} style={styles.spintBtn}>
              <View style={styles.select}></View>
              <Image
                source={require('../../assets/spin.png')}
                style={{width: 70, height: 70}}
              />
            </TouchableOpacity>
            <View>
              <Image
                source={require('../../assets/wheelbg.png')}
                style={{
                  width: containerWheelSize + 100,
                  height: containerWheelSize + 100,
                }}
              />
            </View>
            <Animated.View
              style={[
                styles.wheel,
                {
                  transform: [
                    {
                      rotate: rotate,
                    },
                  ],
                },
              ]}>
              <Svg
                viewBox="-1 -1 2 2"
                style={{transform: [{rotate: '-90deg'}], zIndex: 1}}>
                {slice(slices, colors)}
              </Svg>
            </Animated.View>
            <Animated.View
              style={[
                styles.wheel2,
                {
                  transform: [
                    {
                      rotate: rotate,
                    },
                  ],
                },
              ]}>
              <View style={styles.flatList}>
                {slices.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.label,
                      {
                        position: 'absolute',
                        left: getLeftLabel(index),
                        top: getTopLabel(index),
                        transform: [
                          {
                            rotate: getLabelRotate(index),
                          },
                        ],
                      },
                    ]}>
                    <Text style={styles.labelText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        </View>
        <View style={styles.containerRight}>
          {isTablet && (
            <View style={styles.history}>
              <View style={{marginTop: 30}}>
                <Text style={{color: 'black'}}>
                  Danh sách người trúng thưởng
                </Text>
              </View>
              <View style={{marginBottom: 15, width: '100%'}}>
                <FlatList
                  ref={flatListRef}
                  data={historyList}
                  keyExtractor={(player, playerIndex) => playerIndex.toString()}
                  renderItem={({item, index}) => (
                    <List.Item
                      title={item.name}
                      description={`Phần thưởng: ${
                        item.reward || 'N/A'
                      },  Thời gian: ${item.time || 'N/A'}`}
                    />
                  )}
                />
              </View>
            </View>
          )}

          <View style={styles.footer}>
            {isTablet ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {eventData.players[currentPerson] && (
                  <Text style={styles.choosen}>
                    {eventData.players[currentPerson].name}
                  </Text>
                )}
                {eventData.players[currentPerson] && (
                  <Text style={styles.choosenAward}>{selected}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.choosen}>
                {eventData.players[currentPerson]
                  ? eventData.players[currentPerson].name
                  : ''}{' '}
                {eventData.players[currentPerson] && selected ? '- ' : ''}
                {eventData.players[currentPerson] && selected ? selected : ''}
              </Text>
            )}

            {eventData.players[nextPerson] && (
              <Text style={styles.nextChoosen}>
                Người tiếp theo: {eventData.players[nextPerson].name}
              </Text>
            )}

            {!eventData.players[currentPerson] &&
              !eventData.players[currentPerson] &&
              indexEvent !== null &&
              indexEvent >= 0 && (
                <Text style={styles.choosen}>Đã hết người chơi</Text>
              )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  containerTablet: {
    display: 'flex',
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: isTablet ? 9 : 7,
  },

  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: isTablet ? 8 : 0,
  },

  containerRight: {
    marginRight: 20,
    marginVertical: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: isTablet ? 8 : 7,
  },

  headerContainer: {
    marginVertical: isTablet ? hp('1%') : hp('3%'),
    flexDirection: isTablet ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: isTablet ? 'center' : 'space-between',
    flex: 1,
  },

  footer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: isTablet ? 3 : 3,
  },

  history: {
    marginTop: 60,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#ff7600',
    borderStyle: 'solid',
    borderWidth: 2,
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 7,
  },

  button: {
    marginBottom: isTablet ? 0 : 10,
    marginHorizontal: isTablet ? 7 : 0,
    marginLeft: isTablet ? 0 : 7,
    flex: isTablet ? 0 : 1,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: isTablet ? 'flex-start' : 'flex-end',
    flex: isTablet ? 0 : 0,
  },

  textButton: {
    color: 'white',
    fontSize: 15,
  },
  headerName: {
    marginTop: isTablet ? 10 : 0,
    marginBottom: isTablet ? 65 : 60,
    height: 50,
    width: '100%',
    alignContent: 'center',
  },
  option: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerWheel: {
    position: 'relative',
    width: containerWheelSize,
    height: containerWheelSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  spintBtn: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#ff8416',
    borderRadius: 50,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase',
    fontWeight: 600,
    borderColor: '#ff8416',
    borderStyle: 'solid',
    borderWidth: 4,
  },
  select: {
    position: 'absolute',
    top: -28,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ff8416',
    borderLeftColor: 'transparent',
    borderStyle: 'solid',
  },
  wheel: {
    position: 'absolute',
    width: containerWheelSize,
    height: containerWheelSize,
    overflow: 'hidden',
    borderRadius: isTablet ? 500 : 200,
  },
  wheel2: {
    position: 'absolute',
    width: containerWheelSize,
    height: containerWheelSize,
    overflow: 'hidden',
    // borderRadius: isTablet ? 500 : 200,
    zIndex: 2,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  flatList: {
    width: '100%',
    height: '100%',
    position: 'relative',
    // backgroundColor: 'orange',
  },
  label: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
    width: containerWheelSize / widthLabelRewardDevide,
    height: containerWheelSize / heightLabelRewardDevide,
    // borderWidth: 1,
    zIndex: 3,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
  data: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  choosen: {
    fontSize: isTablet ? 30 : 30,
    fontWeight: 'bold',
    color: 'white',
  },
  nextChoosen: {fontSize: 15, fontWeight: 'bold', color: 'white'},
  choosenAward: {fontSize: 50, fontWeight: 'bold', color: 'white'},
});

export default LuckyDraw4;
