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
} from 'react-native';
import Svg, {G, Path, Text as SvgText, SvgUri} from 'react-native-svg';
import Sound from 'react-native-sound';
import {Button} from 'react-native-paper';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

interface Player {
  eventNumber: number;
  // eventName: string,
  name: string;
  reward: string;
  time: Timestamp;
}

const LuckyDraw3: React.FC = ({navigation}: any) => {
  // const [slices, setSlices] = useState<string[]>([
  //   '1111111111111111111111111111',
  //   '222222222222222222222222',
  //   '3',
  //   '444444444444444444444444',
  // ]);
  const [slices, setSlices] = useState<string[]>([
    '500k',
    '500k',
    '500k',
    '500k',
    '5000k',
    '500k',
    '500k',
    '500k',
    '500k',
    '1000k',
    '500k',
    '500k',
    '500k',
    '2000k',
    '500k',
    '500k',
    '500k',
    '1000k',
    '500k',
    '500k',
  ]);
  const initialPlayers: Player[] = [];
  const [players, setPlayers] = useState(initialPlayers);
  const rotateTime = 4;
  const [totalRotate, setTotalRotate] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const animatedValue = useRef(new Animated.Value(0)).current;

  const sounds: (Sound | null)[] = [null, null];
  const audioList = [
    {
      title: 'Play xoXO',
      isRequire: true,
      url: require('../../assets/sound/xoSo.mp3'),
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

  function stopSound(index: number) {
    const sound = sounds[index];
    if (sound) {
      sound.stop(() => {
        sound.release();
        console.log(`Âm thanh ${index} đã dừng`);
      });
      // Xóa đối tượng âm thanh khỏi mảng sau khi dừng
      sounds[index] = null;
    }
  }

  const [hasRunEffect, setHasRunEffect] = useState(false);
  useEffect(() => {
    if (!hasRunEffect) {
      playSound(0);
      setHasRunEffect(true);
    }
  }, [hasRunEffect]);

  const percentEach = 1 / slices.length;
  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg'],
  });

  const handleSpinClick = () => {
    const value = Math.round(Math.random() * 300) * percentEach / 10;
    // const value = 0.1;
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
      setSelected(choosenValue(totalRotate + value));
    }, rotateTime * 1000);
  };

  const choosenValue = (rotated: number) => {
    const percent = (rotated * 1000) % 100;
    const index =
      Math.floor((percent + percentEach * 50 + 0.14) / (percentEach * 100)) %
      slices.length;
    return slices[index];
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

  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <Button
          buttonColor="#ff8416"
          mode="contained"
          onPress={() => navigation.navigate('Events')}>
          Lịch sử
        </Button>
        <Button
          buttonColor="#ff8416"
          mode="contained"
          onPress={() => navigation.navigate('Events')}>
          Sự kiện
        </Button>
      </View>
      <View style={styles.containerWheel}>
        <TouchableOpacity onPress={handleSpinClick} style={styles.spintBtn}>
          <View style={styles.select}></View>
          <Image
            source={require('../../assets/spin.png')}
            style={{width: 50, height: 50}}
          />
        </TouchableOpacity>
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
          <Image
            source={require('../../assets/wheel.png')}
            style={{width: 400, height: 400}}
          />
        </Animated.View>
      </View>
      <Text style={styles.choosen}>{selected}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  option: {
    marginTop: 23,
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerWheel: {
    position: 'relative',
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 400,
    height: 400,
    backgroundColor: '#ffcd2a',
    overflow: 'hidden',
    borderRadius: 200,
  },
  data: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  choosen: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default LuckyDraw3;
