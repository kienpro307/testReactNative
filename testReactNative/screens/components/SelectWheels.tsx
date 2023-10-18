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
import {setIndexWheel} from '../store/dataSlice';
import {useDispatch} from 'react-redux';

const isTablet = DeviceInfo.isTablet();

const SelectWheels: React.FC = ({navigation}: any) => {
  interface WheelData {
    wheelName: string;
    slices: string[];
    colors: string[];
  }
  const dispatch = useDispatch();
  const [wheelDataList, setWheelDataList] = useState<WheelData[]>([]);
  const isFocused = useIsFocused();
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null,
  );
  const [visible, setVisible] = React.useState(false);
  const [wheelDelete, setWheelDelete] = useState<number>(-1);
  const hideDialog = () => setVisible(false);

  const handleWheelSelection = (index: number) => {
    dispatch(setIndexWheel(index));
    navigation.navigate('Home');
  };

  const handleAccordionToggle = (index: number) => {
    if (selectedAccordion === index) {
      setSelectedAccordion(null); // Nếu đã chọn lại cùng một accordion, đóng nó lại
    } else {
      setSelectedAccordion(index); // Nếu chọn một accordion mới, mở nó ra
    }
  };

  const isAccordionOpen = (index: number) => selectedAccordion === index;

  const handleDeleteWheel = (index: number) => {
    const updatedWheelDataList = wheelDataList.filter((_, i) => i !== index);
    setWheelDataList(updatedWheelDataList);
    saveData(updatedWheelDataList);
    setVisible(false);
  };

  const saveData = async (updatedWheelDataList: WheelData[]) => {
    try {
      const jsonData = JSON.stringify(updatedWheelDataList);
      await AsyncStorage.setItem('wheelDataList', jsonData);
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('wheelDataList');
      if (jsonValue !== null) {
        setWheelDataList(JSON.parse(jsonValue));
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
          onPress={() => navigation.navigate('AddWheel')}
          labelStyle={styles.textButton}>
          Thêm vòng quay
        </Button>
      </View>
      <View style={styles.WheelList}>
        <FlatList
          data={wheelDataList}
          keyExtractor={(wheel, wheelIndex) => wheelIndex.toString()}
          renderItem={({item, index}) => (
            <View style={styles.wheel}>
              <View style={styles.item}>
                <TouchableOpacity
                  style={styles.wheelData}
                  onPress={() => handleAccordionToggle(index)}>
                  <Text style={styles.wheelTitle}>{item.wheelName}</Text>
                </TouchableOpacity>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => handleWheelSelection(index)}
                  labelStyle={styles.textButton}>
                  Chọn
                </Button>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() =>
                    navigation.navigate('UpdateWheel', {index: index})
                  }
                  labelStyle={styles.textButton}>
                  Sửa
                </Button>
                <Button
                  style={styles.buttonAction}
                  buttonColor="#ff8416"
                  mode="contained"
                  onPress={() => [setVisible(true), setWheelDelete(index)]}
                  labelStyle={styles.textButton}>
                  Xóa
                </Button>
              </View>

              {isAccordionOpen(index) && (
                <View style={styles.slicesList}>
                  <FlatList
                    data={item.slices}
                    keyExtractor={(player, playerIndex) =>
                      playerIndex.toString()
                    }
                    renderItem={({item, index}) => (
                      <Text style={styles.slice}>{item}</Text>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
      <Dialog visible={visible} onDismiss={hideDialog} style={{zIndex: 10}}>
        <Dialog.Title>Bạn có chắc muốn xóa vòng quay không</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={() => handleDeleteWheel(wheelDelete)}>Đồng ý</Button>
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
  slicesList: {
    backgroundColor: 'white',
  },
  slice: {
    fontSize: 17,
    color: 'black',
    marginBottom: 5,
    paddingLeft: isTablet ? 40 : 40,
  },
  wheelTitle: {
    fontSize: 20,
    paddingLeft: isTablet ? 60 : 10,
    paddingTop: 5,
    color: 'black',
  },
  WheelList: {
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    height: hp('70%'),
  },
  wheel: {
    backgroundColor: 'orange',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  wheelData: {
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

export default SelectWheels;
