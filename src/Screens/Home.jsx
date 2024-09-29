import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Record from './Record';

//Awsome Slider
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';




const Home = () => {
  return (
    <View>
      <Record />
    </View>
  )
}

export default Home ;

const styles = StyleSheet.create({})