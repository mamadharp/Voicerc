import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/Screens/Home';
import Record from './src/Screens/Record';
import ListOfRecords from './src/Screens/ListOfRecords';
import Play from './src/Screens/Play';


const Stack = createNativeStackNavigator();

const App = () => {
  return (

    <GestureHandlerRootView style={{ flex: 1 }} >

      <NavigationContainer>

        <Stack.Navigator screenOptions={{headerShown : false ,}} initialRouteName='LIST_SCREEN' >

          <Stack.Screen name='HOME_SCREEN' component={Home} />

          <Stack.Screen name='RECORD_SCREEN'component={Record} />

          <Stack.Screen name='LIST_SCREEN' component={ListOfRecords} />

          <Stack.Screen name='PLAY_SCREEN' component={Play} />

        </Stack.Navigator>

      </NavigationContainer>

    </GestureHandlerRootView>
    

  )
}

export default App

const styles = StyleSheet.create({})