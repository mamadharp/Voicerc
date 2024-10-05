import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View , Button , Alert } from 'react-native'
import Sound from 'react-native-sound';



const Play = ({ route, navigation }) => {

    const { filePath, fileName } = route.params; // دریافت مسیر و نام فایل از ناوبری
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        // بارگذاری و آماده‌سازی فایل صوتی
        const newSound = new Sound(filePath, '', (error) => {
          if (error) {
            Alert.alert('Error', 'Failed to load the sound');
            return;
          }
          setSound(newSound);
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
          sound.play((success) => {
            if (!success) {
              Alert.alert('Error', 'Playback failed');
            }
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
    };


    const stopAudio = () => {
        if (sound) {
          sound.stop(() => {
            setIsPlaying(false);
          });
        }
    };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        
        <Text style={{ fontSize: 20, marginBottom: 20 }}>{fileName}</Text>

        <Button
            title={isPlaying ? 'Stop Playing' : 'Start Playing'}
            onPress={isPlaying ? stopAudio  : playAudio}
        />

    </View>
  )
}

export default Play

const styles = StyleSheet.create({})