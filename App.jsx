import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/Screens/Home';


const Stack = createNativeStackNavigator();

const App = () => {
  return (

    <GestureHandlerRootView style={{ flex: 1 }} >

      <NavigationContainer>

        <Stack.Navigator screenOptions={{headerShown : false ,}} >

          <Stack.Screen name='HOME_SCREEN' component={Home} />

        </Stack.Navigator>

      </NavigationContainer>

    </GestureHandlerRootView>
    

  )
}

export default App

const styles = StyleSheet.create({})