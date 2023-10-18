/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';

const Guide: React.FC = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Hướng dẫn sử dụng</Text>
      </View>
      <View style={styles.scrollView}>
        <ScrollView>
          <View style={styles.instructionRow}>
            <Text style={styles.boldText}>Vòng quay: </Text>
            <Text style={styles.text}>
              Vòng quay giống như một bánh xe đặc biệt. Bạn có thể tạo bánh xe
              này với những phần thưởng bạn thích, giống như khi bạn chọn những
              món quà bạn muốn nhận vào ngày sinh nhật. Mỗi vòng quay phải có ít
              nhất 2 phần thưởng
            </Text>
            <Text style={styles.text}>
              Dưới đây là minh họa cho một bánh xe với các phần thưởng là: "Phần
              thưởng 1", "Phần thưởng 2", "Phần thưởng 3", "Phần thưởng 4"
            </Text>
            <Image
              source={require('../../assets/example.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.instructionRow}>
            <Text style={styles.boldText}>Người chơi: </Text>
            <Text style={styles.text}>
              Người chơi giống như các bạn trong trò chơi. Đây là những người
              tham gia cuộc chơi hoặc sự kiện. Bạn có thể tạo danh sách những sự
              kiện mà bạn muốn chơi. Có thể thêm, sửa hoặc xóa các sự kiện này.
              Người chơi ở mỗi sự kiện không được trùng lặp nhau
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <Text style={styles.boldText}>Lịch sử: </Text>
            <Text style={styles.text}>
              Lịch sử giống như việc ghi chép những gì bạn đã làm. Nó lưu thông
              tin về những người chơi tham gia một trò chơi và những món quà mà
              họ đã thắng. Nó giúp bạn nhớ lại những gì đã xảy ra.
            </Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.button}>
        <Button
          buttonColor="#ff8416"
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          labelStyle={styles.textButton}>
          Đã hiểu
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffbc00',
  },
  title: {
    marginTop: 20,
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'white',
  },
  text: {marginVertical: 5, color: 'white'},
    button: {
      marginTop: 20,
    flex: 2,
  },
  textButton: {
    color:"white",
    fontSize: 15,
  },
  scrollView: {
    flex: 8,
    marginHorizontal: 20,
  },
  instructionRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Guide;
