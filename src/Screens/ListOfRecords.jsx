import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert , Button , TextInput  } from 'react-native'
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {Picker} from '@react-native-picker/picker';

//Icons

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { iconSizes, spacing } from '../constants/dimensions';

const ListOfRecords = () => {
    
    const [audioFiles, setAudioFiles] = useState([]);
    const [renamingFile, setRenamingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [sortOption, setSortOption] = useState('name'); // گزینه پیش‌ فرض: مرتب‌سازی بر اساس نام

    
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

    // تابع مرتب‌سازی بر اساس پارامتر انتخابی
    const sortFiles = (files, option) => {
        if (option === 'name') {
            return files.sort((a, b) => a.name.localeCompare(b.name));
        } else if (option === 'size') {
            return files.sort((a, b) => a.size - b.size);
        } else if (option === 'date') {
            return files.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
        }
        return files;
    };

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

    //تغیر نام فایل

    const renameFile = async (oldFilePath, newFileName) => {
        if (!newFileName) {
          Alert.alert('Error', 'New file name cannot be empty');
          return;
        }
    
        try {
          const newFilePath = `${RNFS.DownloadDirectoryPath}/${newFileName}.mp3`;
          await RNFS.moveFile(oldFilePath, newFilePath);
          Alert.alert('Success', 'File renamed successfully');
          setRenamingFile(null);
          setNewFileName('');
          fetchAudioFiles(); // لیست فایل‌ها را دوباره بارگذاری می‌کنیم
        } catch (error) {
          console.error('Error renaming file:', error);
        }
    };

    // حذف فایل با تأیید

    const confirmDeleteFile = (filePath) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this file?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Deletion cancelled'),
                    style: 'cancel',
                },

                {
                     text: 'Delete',
                    onPress: () => deleteFile(filePath),
                    style: 'destructive',
                 },
            ],
            { cancelable: true }
        );
    };

    // حذف فایل

    const deleteFile = async (filePath) => {
        try {
            await RNFS.unlink(filePath);
            Alert.alert('Deleted', 'File deleted successfully');
            fetchAudioFiles(); // لیست فایل‌ها را دوباره بارگذاری می‌کنیم
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // فرمت کردن سایز فایل به کیلوبایت یا مگابایت

     const formatFileSize = (size) => {
        if (size < 1024) {
            return `${size} B`;
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }
    };

    // فرمت کردن تاریخ ساخت فایل
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };


    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            {renamingFile === item.path ? (
                <>
                    <TextInput
                        style={{ flex: 1, borderBottomWidth: 1, borderColor: '#ccc', marginRight: 10 }}
                        value={newFileName}
                        onChangeText={setNewFileName}
                        placeholder="Enter new name"
                    />

                    <TouchableOpacity onPress={() => renameFile(item.path, newFileName)} style ={styles.icons} >
                        <FontAwesome name = {"check"}  size = {iconSizes.md} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setRenamingFile(null)} style ={styles.icons} >
                        <FontAwesome name = {"close"}  size = {iconSizes.md} />
                    </TouchableOpacity>

                </>
            
            ) : (
                <>
                    <TouchableOpacity onPress={() => playAudio(item.path)} style={{ flex: 1 }}>
                        
                        <Text>{item.name}</Text>

                        <Text style={{ fontSize: 12, color: 'gray' }}>{formatFileSize(item.size)}</Text>

                        <Text style={{ fontSize: 12, color: 'gray' }}>{formatDate(item.mtime)}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setRenamingFile(item.path)} style ={styles.icons} >
                        <FontAwesome name = {"pencil"}  size = {iconSizes.md} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => confirmDeleteFile(item.path)} style = {styles.icons} >
                        <FontAwesome name = {"trash-o"}  size = {iconSizes.md} />
                    </TouchableOpacity>

                </>
             )}
      </View>
    );

  return (
    <View style = {{flex : 1}} >
        <Text style={styles.HeadingText}>List of Recorded Audios</Text>

        {/* منوی انتخاب برای مرتب‌سازی */}
        <View style={{ flexDirection : "row" }}>
            <Text style={{ paddingLeft: 15 , paddingTop : 17 }}>Sort by :</Text>
            <Picker
                selectedValue={sortOption}
                style={{ height: 20, width: 110 }}
                onValueChange={(itemValue) => setSortOption(itemValue)}
            >
                <Picker.Item label="Name" value="name" />
                <Picker.Item label="Size" value="size" />
                <Picker.Item label="Date" value="date" />
            </Picker>
        </View>

        <View style = {styles.flatlistContainer} >
            {audioFiles.length > 0 ? (
            
                <FlatList
                    data={sortFiles(audioFiles, sortOption)}
                    keyExtractor={item => item.path}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 300 }}
                />
             ) : (
                <Text>No recorded files found</Text>
             )}
        </View>

        
    </View>
  )
}

export default ListOfRecords

const styles = StyleSheet.create({
    icons : {

        paddingRight : spacing.lg ,
    },
    flatlistContainer : {

        paddingLeft : spacing.sm
    } ,
    HeadingText : {
        fontSize: 20,
        padding : spacing.md ,

    }
})