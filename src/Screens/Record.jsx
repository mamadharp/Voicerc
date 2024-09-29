import React, { useState } from 'react';
import { View, Button , StyleSheet , Text  } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';



const audioRecorderPlayer = new AudioRecorderPlayer();

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
   

   
  
   const startRecording = async () => {
    
    setRecording(true);
    
    // مسیر برای ذخیره فایل صوتی

    const path = `${RNFS.DownloadDirectoryPath}/recorded_audio_${Date.now()}.mp3`;
    setFilePath(path);

    await audioRecorderPlayer.startRecorder(path);

   };

   const stopRecording = async () => {

    setRecording(false);

    // متوقف کردن ضبط
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    
    };


  return (

    <View>
        
      <Text>{recording ? 'Recording...' : 'Press to Record'}</Text>
      {recording ? (
        <Button title="Stop Recording" onPress={stopRecording} />
      ) : (
        <Button title="Start Recording" onPress={startRecording} />
      )}
    </View>

  )
}

export default Record

const styles = StyleSheet.create({})