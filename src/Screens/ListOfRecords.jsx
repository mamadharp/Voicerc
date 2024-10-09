import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert , Button , TextInput  } from 'react-native'
import RNFS from 'react-native-fs';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

//Icons

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fontSize, iconSizes, spacing } from '../constants/dimensions';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fonts';

const ListOfRecords = () => {
    
    const [audioFiles, setAudioFiles] = useState([]);
    const [renamingFile, setRenamingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [sortOption, setSortOption] = useState('name'); // گزینه پیش‌ فرض: مرتب‌سازی بر اساس نام
    const navigation = useNavigation(); // استفاده از navigation

    
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

    // تابع مرتب‌ سازی بر اساس پارامتر انتخابی
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
        <View style={styles.ListSTL}>
            {renamingFile === item.path ? (
                <>
                    <TextInput
                        style={styles.RenameText}
                        value={newFileName}
                        onChangeText={setNewFileName}
                        placeholder="Enter new name"
                        placeholderTextColor={colors.textPrimary}
                    />

                    <TouchableOpacity onPress={() => renameFile(item.path, newFileName)} style ={{paddingRight : spacing.lg }} >
                        <FontAwesome name = {"check"}  size = {iconSizes.md} color = {colors.iconPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setRenamingFile(null)} style ={{paddingRight : spacing.sm }} >
                        <FontAwesome name = {"close"}  size = {iconSizes.md} color = {colors.iconPrimary} />
                    </TouchableOpacity>

                </>
            
            ) : (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('PLAY_SCREEN', { filePath: item.path, fileName: item.name })}
                     style={{ flex: 1 }}>
                        
                        <Text style = {styles.ListHeadText} >{item.name}</Text>

                        <Text style={styles.ListSecondText}>{formatFileSize(item.size)}</Text>

                        <Text style={styles.ListSecondText}>{formatDate(item.mtime)}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setRenamingFile(item.path)} style ={{paddingRight : spacing.lg }} >
                        <FontAwesome name = {"pencil"}  size = {iconSizes.md} color = {colors.iconPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => confirmDeleteFile(item.path)} style = {{paddingRight : spacing.sm }} >
                        <FontAwesome name = {"trash-o"}  size = {iconSizes.md} color = {colors.iconPrimary} />
                    </TouchableOpacity>

                </>
             )}
      </View>
    );

  return (
    <View style = {styles.Container} >

        <View style = {styles.headerContainer} >

            <TouchableOpacity onPress={() => navigation.navigate('HOME_SCREEN')} >

                <AntDesign name = {"arrowleft"}  size = {iconSizes.md} color = {colors.iconPrimary} />

            </TouchableOpacity>

            <Text style={styles.HeadingText}>List of Record's</Text>

        </View>
        

        {/* منوی انتخاب برای مرتب‌سازی */}
        <View style={{ flexDirection : "row" }}>
            <Text style={styles.SecondHeadText}>Sort by  : </Text>
            <Picker
                selectedValue={sortOption}
                style={styles.Pickerr}
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
    Container : {
        flex : 1 ,
        backgroundColor : colors.background
    } ,

    headerContainer : {
        flexDirection : "row" ,
        justifyContent : "space-between" ,
        padding : spacing.md ,
    } ,


    flatlistContainer : {

        paddingLeft : spacing.sm ,
        paddingRight : spacing.sm ,
    } ,

    HeadingText : {
        color : colors.textPrimary ,
        fontSize : fontSize.xl ,
        fontFamily : fontFamilies.bold ,

    },

    SecondHeadText : {
        paddingLeft: 15 ,
        paddingTop : 13 ,
        color : colors.textPrimary ,
        fontSize : fontSize.lg ,
        fontFamily : fontFamilies.semiBold ,
    } ,

    ListHeadText :{
        color : colors.textPrimary ,
        fontSize : fontSize.md ,
        fontFamily : fontFamilies.medium ,
    } ,

    ListSecondText : {
        color : colors.textSecondary ,
        fontSize : fontSize.bsmd ,
        fontFamily : fontFamilies.regular ,

    } ,

    ListSTL : {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.iconSecondary ,

    } ,

    RenameText : {
        color : colors.textPrimary ,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: colors.textSecondary,
        marginRight: 10 ,
    } ,
    Pickerr : {
        height: 20,
        width: 110 ,
        color : colors.textPrimary ,
    } ,

})