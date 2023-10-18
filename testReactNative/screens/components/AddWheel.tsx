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
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const isTablet = DeviceInfo.isTablet();

const AddWheel: React.FC = ({navigation}: any) => {
  interface WheelData {
    wheelName: string;
    slices: string[];
    colors: string[];
  }

  // const initialPlayers: Player[] = [];
  // const [slices, setPlayers] = useState(initialPlayers);
  const [wheelName, setWheelName] = useState('');
  const [slice, setSlice] = useState('');
  const [editingSliceIndex, setEditingSliceIndex] = useState(-1);
  const [editingSlice, setEditingSlice] = useState('');
  const [slices, setSlices] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [wheelData, setWheelData] = useState<WheelData>({
    wheelName: '',
    slices: [],
    colors: [],
  });
  const [wheelDataList, setWheelDataList] = useState<WheelData[]>([]);

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
    // Thực hiện các tác vụ xóa người chơi khỏi danh sách
    setSlices(prevSlices => {
      const updatedSlices = [...prevSlices];
      updatedSlices.splice(index, 1);
      return updatedSlices;
    });
  };

  const handleSubmit = async () => {
    if (wheelName !== '' && slices.length > 1) {
      const newWheelData = {
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

        wheelDataListTemp.push(newWheelData);

        await AsyncStorage.setItem(
          'wheelDataList',
          JSON.stringify(wheelDataListTemp),
        );
        setWheelDataList(wheelDataListTemp);
        navigation.goBack();
      } catch (err) {
        console.log(err);
      }

      setWheelName('');
      setSlices([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Tên vòng quay"
        value={wheelName}
        onChangeText={text => setWheelName(text)}
        style={styles.text}
      />
      <TextInput
        label="Thêm phần thưởng (số phần thưởng phải >= 2)"
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
                  onPress={() => handleSaveSlice(item, index)}>
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
    flex: 5,
  },
  sliceInfoEdit: {
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

export default AddWheel;
