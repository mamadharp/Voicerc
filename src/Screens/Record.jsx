import React, { useState , useRef, useEffect} from 'react';
import { View, Button , StyleSheet , Text, TouchableOpacity , Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//Icons

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontSize, iconSizes, spacing } from '../constants/dimensions';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fonts';



const audioRecorderPlayer = new AudioRecorderPlayer();

//const RECORD_FOLDER = `${RNFS.DownloadDirectoryPath}/MyRecords`; // مسیر پوشه رکورد

const Record = () => {

  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
  
      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('Permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const [recording, setRecording] = useState(false);
  const [filePath, setFilePath] = useState('');
  const navigation = useNavigation();
  const [timer, setTimer] = useState(0); // ذخیره زمان ضبط
  const intervalRef = useRef(null); // برای ذخیره `interval` جهت توقف آن بعداً


  


  const startTimer = () => {

    intervalRef.current = setInterval(() => {

      setTimer(prev => prev + 1); // هر ثانیه یک ثانیه اضافه می‌شود

    }, 1000);
  };

   
  const stopTimer = () => {

    if (intervalRef.current) {

      clearInterval(intervalRef.current);

    }
  };

  // تبدیل ثانیه به ساعت، دقیقه و ثانیه
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
   
  
  const startRecording = async () => {
    
      setRecording(true);

      {/* 
        
        // چک کردن وجود پوشه
        const folderExists = await RNFS.exists(RECORD_FOLDER);
        if (!folderExists) {
          // ایجاد پوشه در صورت نبود آن
          await RNFS.mkdir(RECORD_FOLDER);
          console.log('Record folder created.');
        } else {
          console.log('Record folder already exists.');
        }

      */}

      // مسیر برای ذخیره فایل صوتی در داخل پوشه رکورد
      const path = `${RNFS.ExternalDirectoryPath}/recorded_audio_${Date.now()}.mp3`;//این گونه فایل ظبط شده در خود فایل های دیتای برنامه ذخیره میشود البته فقط برای اندروید
      console.log('Recording to : ', path);
      setFilePath(path);

      // شروع ضبط صدا
      await audioRecorderPlayer.startRecorder(path);
      console.log('Recording started.');

      setTimer(0); // ریست تایمر به صفر
      startTimer(); // شروع تایمر

    
  };

  const stopRecording = async () => {

    setRecording(false);

    // متوقف کردن ضبط
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    stopTimer();
    setTimer(0);

    const fileName = filePath.split('/').pop(); // گرفتن نام فایل از مسیر
    Alert.alert('Recording Saved', `Your file has been saved as: ${fileName}`);
    
  };

  useEffect(() => {
    return () => {
      // اطمینان از پاک کردن تایمر در صورت خروج از صفحه
      stopTimer();
    };
  }, []);


  return (

    <View style = {styles.Container} >

      <View style= {styles.headerContainer} >

        <Text style = {styles.headingtext} >voice recorder</Text>

        <TouchableOpacity onPress={() => navigation.navigate('LIST_SCREEN')} >
          <Text style = {styles.headingtext} >List</Text>
        </TouchableOpacity>

      </View>
        

      <Text style = {styles.TimerText} >{formatTime(timer)}</Text>

      <View style ={styles.recordIconContainer} >

        {recording ? (

          <TouchableOpacity onPress={stopRecording} >
            <MaterialCommunityIcons name = {"stop-circle"} size = {iconSizes.xxxl} color = {"red"} />
          </TouchableOpacity>

        ) : 
        (

          <TouchableOpacity onPress={startRecording} >
            <MaterialCommunityIcons name = {"record"} size = {iconSizes.xxxxl} color = {"red"} />
          </TouchableOpacity>

        ) }

      </View>


    </View>

  )
}

export default Record

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

  headingtext : {
    color : colors.textPrimary ,
    fontSize : fontSize.xl ,
    fontFamily : fontFamilies.bold ,
  } ,
  recordIconContainer : {
    alignItems : "center" ,
    paddingTop : spacing.xxxxl ,
  } ,

  TimerText : {
    alignSelf : "center" ,
    color : colors.textPrimary ,
    fontSize : fontSize.xxxl ,
    fontFamily : fontFamilies.number ,
    marginTop : 300 ,
  } ,
})