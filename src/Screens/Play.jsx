import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View , Button , Alert, TouchableOpacity } from 'react-native'
import Sound from 'react-native-sound';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

//icons

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { iconSizes, spacing } from '../constants/dimensions';



const Play = ({ route, navigation }) => {

    const { filePath, fileName } = route.params; // دریافت مسیر و نام فایل از ناوبری
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0); // طول کل فایل صوتی
    const [pausedPosition, setPausedPosition] = useState(0); // موقعیت مکث
    const [currentPosition, setCurrentPosition] = useState(0);

    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(0);


    useEffect(() => {
        // بارگذاری و آماده‌سازی فایل صوتی
        const newSound = new Sound(filePath, '', (error) => {
          if (error) {
            Alert.alert('Error', 'Failed to load the sound');
            return;
          }

          setSound(newSound);
          setDuration(newSound.getDuration()); // دریافت مدت زمان کل صدا
          max.value = newSound.getDuration();// تنظیم حداکثر مقدار اسلایدر
        });

        // توقف پخش و پاک کردن منابع هنگام خروج از صفحه

        return () => {
            if (newSound) {
              // توقف پخش صدا در صورت پخش بودن
              if (isPlaying) {
                newSound.stop(() => {
                  console.log('Audio stopped on unmount');
                });
              }
              newSound.release(); // آزادسازی منابع صدا
              setIsPlaying(false); // اطمینان از اینکه وضعیت به‌روز شده
            }
        };

    }, [filePath]);


    const playAudio = () => {
        if (sound) {

          // اگر صدا قبلاً مکث شده بود، از آن نقطه ادامه دهد
          if (pausedPosition > 0) {
            sound.setCurrentTime(pausedPosition);
          }

          sound.play((success) => {
            if (!success) {
              Alert.alert('Error', 'Playback failed');
            }
            setIsPlaying(false);
          });

          // آپدیت زمان فعلی در هر ثانیه

          const interval = setInterval(() => {
            sound.getCurrentTime((seconds) => {

              progress.value = seconds ; // به‌روزرسانی زمان فعلی پخش در اسلایدر

              setCurrentPosition(seconds);

            });
          }, 1000);

          setIsPlaying(true);

          return () => clearInterval(interval); // حذف interval هنگام خروج از صفحه

        }
    };


    const pauseAudio = () => {
      if (sound) {

          sound.pause(() => {

              sound.getCurrentTime((seconds) => {

                  setPausedPosition(seconds); // ذخیره موقعیت مکث

                  setIsPlaying(false);

              });
          });
      }
    };


    const stopAudio = () => {
        if (sound) {
          sound.stop(() => {

            setIsPlaying(false);

            progress.value = 0 ; // بازنشانی زمان فعلی

            setPausedPosition(0); // بازنشانی موقعیت مکث

          });
        }
    };

    const seekAudio = (value) => {
      if (sound) {
        sound.setCurrentTime(value); // تغییر موقعیت پخش بر اساس اسلایدر
        progress.value = value; // به‌روزرسانی مقدار اسلایدر

        setCurrentPosition(value); // بروز رسانی موقعیت فعلی

      }
    };


    // تابع کمک کننده برای تبدیل زمان به دقیقه و ثانیه
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Add leading zero for seconds
  };


  return (
    <View style={{ flex: 1, padding: 20 }}>
        
        <Text style={{ fontSize: 20, marginBottom: 20 }}>{fileName}</Text>

        <Slider
          style={styles.SliderContainer}
          progress={progress}
          minimumValue={min}  // مقدار حداقل از useSharedValue
          maximumValue={max}  // مقدار حداکثر از useSharedValue
          onSlidingComplete={seekAudio}  // تغییر موقعیت پخش با حرکت کاربر
          thumbWidth={spacing.md}
          containerStyle = {{
            height : 7 ,
            borderRadius : spacing.sm ,
          }}
          theme={{
            maximumTrackTintColor: "blue",
            minimumTrackTintColor: "gray",
          }}
        />

        <Text>{`Current Time: ${formatTime(currentPosition)} / Duration: ${formatTime(duration)}`}</Text>

        {isPlaying ? (
          <TouchableOpacity onPress={pauseAudio} >

            <FontAwesome6 name = {"pause"}  size = {iconSizes.xl} />

          </TouchableOpacity>
        ) :
        (

          <TouchableOpacity onPress={playAudio} >

            <FontAwesome6 name = {"play"}  size = {iconSizes.xl} />

          </TouchableOpacity>

        ) }


    </View>
  )
}

export default Play ;

const styles = StyleSheet.create({
  SliderContainer : {
    marginVertical : spacing.xl ,
}
})