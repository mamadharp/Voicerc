import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert} from 'react-native'
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const ListOfRecords = () => {
    
    const [audioFiles, setAudioFiles] = useState([]);

    
    // خواندن فایل‌ها از مسیر

    const fetchAudioFiles = async () => {
        try {
            const files = await RNFS.readDir(RNFS.DownloadDirectoryPath); // لیست فایل‌های دایرکتوری
            const audioFiles = files.filter(file => file.name.endsWith('.mp3')); // فقط فایل‌های صوتی
            setAudioFiles(audioFiles);
        } catch (error) {
            console.error('Error reading directory:', error);
         }
  };

  useEffect(() => {

    fetchAudioFiles();

  }, []);

    // پخش فایل صوتی
    const playAudio = (filePath) => {
        const sound = new Sound(filePath, '', (error) => {
          if (error) {
            Alert.alert('Error', 'Failed to load the sound');
            return;
          }
          sound.play((success) => {
            if (!success) {
              Alert.alert('Error', 'Playback failed');
            }
          });
        });
      };

    const renderItem = ({ item }) => (
        <TouchableOpacity
          style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
          onPress={() => playAudio(item.path)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
    );

  return (
    <View>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>List of Recorded Audios</Text>
        {audioFiles.length > 0 ? (
            <FlatList
                data={audioFiles}
                keyExtractor={item => item.path}
                renderItem={renderItem}
             />
        ) : (
            <Text>No recorded files found</Text>
         )}
    </View>
  )
}

export default ListOfRecords

const styles = StyleSheet.create({})