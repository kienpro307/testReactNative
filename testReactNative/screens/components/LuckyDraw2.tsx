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
} from 'react-native';
import Svg, {G, Path, Text as SvgText} from 'react-native-svg';
import Sound from 'react-native-sound';

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

const LuckyDraw2 = () => {
  // const [slices, setSlices] = useState<string[]>([
  //   '1111111111111111111111111111',
  //   '222222222222222222222222',
  //   '3',
  //   '444444444444444444444444',
  // ]);
  const [slices, setSlices] = useState<string[]>(['1', '2', '3', '4']);
  const [spinNum, setSpinNum] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg'],
  });
  const percentEach = 1 / slices.length;

  function playSound(index: number) {
    const audioItem = audioList[index];
    sounds[index] = new Sound(audioItem.url, (error: string | undefined) => {
      if (error) {
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

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getCoordinatesForPercent(percent: number): [number, number] {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  function slice(slices: string[]) {
    let cumulativePercent = 0;

    return slices.map(slice => {
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += percentEach;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

      const xLabel = (startX + endX) / 2;
      const yLabel = (startY + endY) / 2;

      // console.log('>>> cumulativePercent', cumulativePercent);
      // console.log('>>> startX', startX);
      // console.log('>>> startY', startY);
      // console.log('>>> endX', endX);
      // console.log('>>> endY', endY);

      // console.log('>>> xLabel', xLabel);
      // console.log('>>> yLabel', yLabel);

      // console.log('>>> slice', slice);

      const angleLabel = cumulativePercent - percentEach / 2;
      // console.log('>>> deg', 360 * angleLabel);
      const largeArcFlag = percentEach > 0.5 ? 1 : 0;
      const pathData = [
        `M ${startX} ${startY}`, // Move
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
        'L 0 0', // Line
      ].join(' ');

      return (
        <G key={pathData}>
          <Path d={pathData} fill={getRandomColor()} />

          {/* <Text
            style={[
              styles.data,
              {
                transform: [
                  {rotate: `${360 * angleLabel + 90}deg`},
                  {translateX: xLabel}, // Di chuyển đến vị trí xLabel
                  {translateY: yLabel}, // Di chuyển đến vị trí yLabel
                ],
              },
            ]}>
            {slice}
          </Text> */}
          <SvgText
            x={xLabel}
            y={yLabel}
            transform={`rotate(${360 * angleLabel + 70})`}>
            {slice}
          </SvgText>
        </G>
      );
    });
  }

  const handleSpinClick = () => {
    playSound(0);
    const value = Math.random() + 0.3;
    setSpinNum(value);
    setRotateDeg((rotateDeg + value * 360) % 360);
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: spinNum,
      duration: 4000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [rotateDeg]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSpinClick} style={styles.spintBtn}>
        <View style={styles.select}></View>
        <Text>SPIN</Text>
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
        <Svg viewBox="-1 -1 2 2" style={{transform: [{rotate: '-90deg'}]}}>
          {slice(slices)}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 400,
    height: 400,
    display: 'flex',
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
    borderColor: '#ffcd2a',
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
    borderRightWidth: 8,
    borderBottomWidth: 30,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ff8416',
    borderLeftColor: 'transparent',
    borderStyle: 'solid',
  },
  wheel: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    backgroundColor: '#ffcd2a',
    borderRadius: 200,
    overflow: 'hidden',
    borderColor: '#ff8416',
    borderStyle: 'solid',
    borderWidth: 4,
  },
  data: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LuckyDraw2;
