import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import TrackPlayer, { useTrackPlayerEvents, TrackPlayerEvents, useProgress, State, usePlaybackState } from 'react-native-track-player';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

//icons 

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { fontSize, iconSizes, spacing } from '../constants/dimensions';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fonts';

const PlayAi = ({ route, navigation }) => {
  const { filePath, fileName } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  const progress = useSharedValue(0.7);
  const min = useSharedValue(0);
  const max = useSharedValue(1);
  const isSliding = useSharedValue(false) ;

  // استفاده از هوک useProgress برای دریافت زمان فعلی و مدت زمان کل
  const { duration , position } = useProgress();


  useFocusEffect(
    React.useCallback(() => {
      const setupPlayer = async () => {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: 'trackId',
          url: filePath,
          title: fileName,
          artist: 'Unknown Artist',
        });
      };

      setupPlayer();

      return () => {
        // Reset player only when leaving the screen
        TrackPlayer.reset();
      };
    }, [filePath, fileName])
  );

  if (!isSliding.value) {
    progress.value = duration > 0 ? position / duration : 0; // به‌روزرسانی مقدار اسلایدر با زمان فعلی
  }

  // مدیریت پخش
  const playAudio = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const pauseAudio = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const stopAudio = async () => {
    await TrackPlayer.stop();
    setIsPlaying(false);
  };

  const seekAudio = async (value) => {
    await TrackPlayer.seekTo(value);
    progress.value = value; // به‌روزرسانی مقدار اسلایدر
  };

  // فرمت‌دهی زمان
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.Container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LIST_SCREEN')}>
          <AntDesign name={"arrowleft"} size={iconSizes.md} color={colors.iconPrimary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.HeadingText}>{fileName}</Text>

      <View style={styles.TimeContainer}>
        <Text style={styles.TimeTexts}>{formatTime(position)}</Text>
        <Text style={styles.TimeTexts}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.SliderContainer}>
        <Slider
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          thumbWidth={spacing.md}
          onSlidingStart={() => (isSliding.value = true)}
          onValueChange={async (value) => {await TrackPlayer.seekTo(value * duration)} }
          onSlidingComplete={async (value) => {
            if (!isSliding.value) {
                return ;
            }
            isSliding.value = false ;
            await TrackPlayer.seekTo(value * duration) ;
          } }
          containerStyle={{
            height: 7,
            borderRadius: spacing.sm,
          }}
          theme={{
            maximumTrackTintColor: colors.maximumTintcolor,
            minimumTrackTintColor: colors.minimumTintcolor,
            bubbleBackgroundColor: colors.textSecondary,
          }}
        />
      </View>

      <View style={styles.PlayPauseButtonContainer}>
        { isPlaying ? (
          <TouchableOpacity onPress={pauseAudio}>
            <FontAwesome6 name={"pause"} size={iconSizes.xxl} color={colors.iconPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={playAudio}>
            <FontAwesome6 name={"play"} size={iconSizes.xxl} color={colors.iconPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PlayAi;

const styles = StyleSheet.create({
  
    Container : {
      flex : 1 ,
      backgroundColor : colors.background
    } ,
  
    headerContainer : {
      flexDirection : "row" ,
      justifyContent : "space-between" ,
      padding : spacing.md ,
    } ,
  
    TimeContainer : {
      marginTop : spacing.xxxxl ,
      flexDirection : "row" ,
      justifyContent : "space-between" ,
      padding : spacing.lg ,
    } ,
  
    PlayPauseButtonContainer : {
      alignItems : "center" ,
      paddingTop : spacing.Towxl ,
  
    } ,
  
    TimeTexts : {
      color : colors.textPrimary ,
      fontSize : fontSize.lg ,
      fontFamily : fontFamilies.semiBold ,
    } ,
  
    SliderContainer : {
      
      paddingLeft : spacing.md ,
      paddingRight : spacing.md ,
    } ,
  
    HeadingText : {
      paddingTop : spacing.xxxxl ,
      alignSelf : "center" ,
      color : colors.textPrimary ,
      fontSize : fontSize.lg ,
      fontFamily : fontFamilies.semiBold ,
  
    },
  })
