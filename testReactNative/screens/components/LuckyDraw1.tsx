/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const LuckyDraw1 = () => {
  const data = [100, 142, 34521, 1251, 132, 100, 200, 300, 500, 500, 400];
  const elementRotateDeg = 360 / data.length;
  const [rotateDeg, setRotateDeg] = useState(0);
  const [spinNum, setSpinNum] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '3600deg'],
  });

  const handleSpinClick = () => {
    const value = Math.random() + 0.3;
    console.log('>>> value: ', value);
    console.log('>>> animatedValue: ', animatedValue);

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
    <View>
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
          {data.map((number, index) => (
            <View
              key={index}
              style={[
                styles.number,
                // {
                //   transform: [
                //     {
                //       rotate: `${elementRotateDeg * index}deg`,
                //     },
                //   ],
                // },
              ]}>
              <Text
                style={[
                  styles.data,
                  {
                    transform: [
                      {
                        rotate: `${elementRotateDeg * index}deg`,
                      },
                    ],
                  },
                ]}>
                {number}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
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
  number: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  data: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LuckyDraw1;
