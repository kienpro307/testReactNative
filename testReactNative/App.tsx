/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {StyleSheet, StatusBar, Platform} from 'react-native';
import React, {useEffect} from 'react';
import HomeScreen from './screens/home/HomeScreen';
import AddEvents from './screens/components/AddEvents';
import History from './screens/components/History';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectEvent from './screens/components/SelectEvent';
import UpdateEvent from './screens/components/UpdateEvent';
import SelectWheels from './screens/components/SelectWheels';
import AddWheel from './screens/components/AddWheel';
import UpdateWheel from './screens/components/UpdateWheel';
import {AppProvider} from './screens/AppContext';
import {Provider} from 'react-redux';
import {store} from './screens/store/store';
import SplashScreen from 'react-native-splash-screen';
import Guide from './screens/components/Guide';

const Stack = createNativeStackNavigator();

const App = () => {
  StatusBar.setHidden(true);

  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddEvents"
                component={AddEvents}
                options={{
                  headerTitle: 'Thêm sự kiện',
                }}
              />
              <Stack.Screen
                name="Guide"
                component={Guide}
                options={{
                  headerShown: false,
                  headerTitle: 'Hướng dẫn',
                }}
              />
              <Stack.Screen
                name="UpdateEvent"
                component={UpdateEvent}
                options={{
                  headerShown: false,
                  headerTitle: 'Sửa sự kiện',
                }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{
                  headerTitle: 'Lịch sử',
                }}
              />
              <Stack.Screen
                name="SelectEvent"
                component={SelectEvent}
                options={{
                  headerTitle: 'Lựa chọn sự kiện',
                }}
              />
              <Stack.Screen
                name="SelectWheels"
                component={SelectWheels}
                options={{
                  headerTitle: 'Lựa chọn vòng quay',
                }}
              />
              <Stack.Screen
                name="AddWheel"
                component={AddWheel}
                options={{
                  headerTitle: 'Thêm vòng quay',
                }}
              />
              <Stack.Screen
                name="UpdateWheel"
                component={UpdateWheel}
                options={{
                  headerTitle: 'Sửa vòng quay',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AppProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    width: 50,
    height: 50,
  },
});
export default App;
