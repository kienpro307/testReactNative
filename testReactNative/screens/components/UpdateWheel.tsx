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
import {Button, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const isTablet = DeviceInfo.isTablet();

const UpdateWheel: React.FC = ({route, navigation}: any) => {
  const {index} = route.params;

  interface WheelData {
    wheelName: string;
    slices: string[];
    colors: string[];
  }

  const [wheelName, setWheelName] = useState('');
  const [slice, setSlice] = useState('');
  const [editingSliceIndex, setEditingSliceIndex] = useState(-1);
  const [editingSlice, setEditingSlice] = useState('');
  const [slices, setSlices] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const isFocused = useIsFocused();
  const [wheelData, setWheelData] = useState<WheelData>({
    wheelName: '',
    slices: [],
    colors: [],
  });

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const [wheelDataList, setWheelDataList] = useState<WheelData[]>([]);

  const handleAddSlice = (name: string) => {
    if (slice !== '') {
      setSlices([...slices, name]);
      setColors([...colors, getRandomColor()]);
      setSlice('');
    }
  };

  const handleSaveSlice = (name: string, index: number) => {
    if (name !== '') {
      const updatedSlices = [...slices];
      updatedSlices[index] = name;
      setSlices(updatedSlices);
      setEditingSlice('');
      setEditingSliceIndex(-1);
    } else {
      setEditingSlice('');
      setEditingSliceIndex(-1);
      handleDeleteSlice(index);
    }
  };

  const handleEditSlice = (name: string, index: number) => {
    setEditingSliceIndex(index);
    setEditingSlice(name);
  };

  const handleDeleteSlice = (index: number) => {
    setSlices(prevSlices => {
      const updatedSlices = [...prevSlices];
      updatedSlices.splice(index, 1);
      return updatedSlices;
    });
  };

  const handleUpdateWheel = async () => {
    if (wheelName !== '' && slices.length > 1) {
      const allSlices = wheelDataList.flatMap(wheel => wheel.slices);

      const updatedWheel = {
        wheelName: wheelName,
        slices: slices.map(slice => slice),
        colors: colors.map(color => color),
      };

      try {
        const storedWheelDataListJson = await AsyncStorage.getItem(
          'wheelDataList',
        );
        let wheelDataListTemp: WheelData[] = [];

        if (storedWheelDataListJson) {
          const storedWheelDataList = JSON.parse(storedWheelDataListJson);

          wheelDataListTemp = storedWheelDataList;
        }

        if (index >= 0 && index < wheelDataListTemp.length) {
          wheelDataListTemp[index] = updatedWheel;

          await AsyncStorage.setItem(
            'wheelDataList',
            JSON.stringify(wheelDataListTemp),
          );
          setWheelDataList(wheelDataListTemp);
          navigation.goBack();
        } else {
          console.log('Index không hợp lệ');
        }
      } catch (err) {
        console.log(err);
      }

      setWheelName('');
      setSlices([]);
    }
  };

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('wheelDataList');
      if (jsonValue !== null) {
        const loadedWheelDataList = JSON.parse(jsonValue);
        setWheelDataList(loadedWheelDataList);

        if (index >= 0 && index < loadedWheelDataList.length) {
          const wheel = loadedWheelDataList[index];
          setWheelData(wheel);
          setSlices(wheel.slices);
          setColors(wheel.colors);
          setWheelName(wheel.wheelName);
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
        label="Tên vòng quay"
        value={wheelName}
        onChangeText={text => setWheelName(text)}
        style={styles.text}
      />
      <TextInput
        label="Thêm phần thưởng"
        value={slice}
        onChangeText={text => setSlice(text)}
        onSubmitEditing={() => handleAddSlice(slice)}
        style={styles.text}
      />
      <FlatList
        style={styles.listSlice}
        data={slices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.sliceItem}>
            {index === editingSliceIndex ? (
              <View style={styles.sliceInfoEdit}>
                <TextInput
                  label="Phần thưởng"
                  value={editingSlice}
                  onChangeText={text => setEditingSlice(text)}
                  onSubmitEditing={() => handleSaveSlice(editingSlice, index)}
                />
              </View>
            ) : (
              <View style={styles.sliceInfo}>
                <Text style={{fontSize: 15, color: 'black'}}>
                  {index + 1}. {item}
                </Text>
              </View>
            )}

            {index === editingSliceIndex ? (
              <View style={styles.actionEdit}>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleSaveSlice(editingSlice, index)}>
                  Lưu
                </Button>
              </View>
            ) : (
              <View style={styles.actions}>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleEditSlice(item, index)}>
                  Sửa
                </Button>
                <Button
                  buttonColor="#ff8416"
                  mode="contained"
                  labelStyle={styles.textButton}
                  onPress={() => handleDeleteSlice(index)}>
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
        onPress={() => handleUpdateWheel()}
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
  sliceItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  listSlice: {
    marginTop: 20,
    width: '90%',
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#ff8416',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  sliceInfo: {
    flex: isTablet ? 9 : 6,
  },
  sliceInfoEdit: {
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

export default UpdateWheel;
