/* eslint-disable prettier/prettier */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GoGoSpin from 'react-native-gogo-spin';

const prize = [
  {name: 'x999', image: require('../../assets/king.png')},
  {name: 'x10', image: require('../../assets/prize.png')},
  {name: 'x50', image: require('../../assets/prize.png')},
  {name: 'x80', image: require('../../assets/prize.png')},
  {name: 'x100', image: require('../../assets/prize.png')},
  {name: 'x200', image: require('../../assets/prize.png')},
];
const SIZE = 300;

const LuckyDraw = () => {
  const spinRef = useRef<React.ElementRef<typeof GoGoSpin>>(null);
  const [prizeIdx, setprizeIdx] = useState(-1);
  const doSpin = () => {
    const getIdx = ~~(Math.random() * prize.length);
    setprizeIdx(getIdx);
    spinRef?.current?.doSpinAnimate(getIdx);
  };
  const onEndSpin = (endSuccess: boolean) => {
    console.log('endSuccess', endSuccess);
  };
  return (
    <View style={styles.container}>
      <View style={styles.centerWheel}>
        <GoGoSpin
          onEndSpinCallBack={onEndSpin}
          notShowDividLine={true}
          spinDuration={2000}
          spinReverse={true}
          spinTime={3}
          ref={spinRef}
          width={SIZE}
          height={SIZE}
          radius={SIZE / 2}
          data={prize}
          offsetEnable={true}
          source={require('../../assets/wheel.png')}
          renderItem={(data, i) => {
            return (
              <View key={i} style={styles.itemWrapper}>
                <Text style={styles.prizeText}>{data.name}</Text>
                <Image source={data.image} style={{width: 40, height: 40}} />
              </View>
            );
          }}
        />
        <TouchableOpacity style={{position: 'absolute'}} onPress={doSpin}>
          <Image
            source={require('../../assets/btn.png')}
            style={{width: 105, height: 124}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  startText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  prizeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerWheel: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinBtn: {width: 105, height: 124},
  spinWarp: {position: 'absolute'},
  itemWrap: {width: 40, height: 40},
});
export default LuckyDraw;
