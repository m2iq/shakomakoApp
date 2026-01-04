import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordType ,setRecordType] = useState<string>('video');
  const [uploadingPage , setUploadingPage] = useState<boolean>(false);
  const [title , setTitle] = useState<string>('');
  
  const [selectedFilter, setSelectedFilter] = useState('none');
  const cameraRef = useRef<CameraView>(null);
  const pressTimer = useRef<NodeJS.Timeout | number | null>(null);

  const filters = [
    { id: 'none', name: 'عادي', color: 'transparent' },
    { id: 'warm', name: 'دافئ', color: 'rgba(255,165,0,0.1)' },
    { id: 'cool', name: 'بارد', color: 'rgba(0,150,255,0.1)' },
    { id: 'bw', name: 'أبيض وأسود', color: 'rgba(0,0,0,0.4)' },
  ];

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>يجب منح إذن الكاميرا أولاً</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: '#ff006a' }}>منح الإذن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => setCameraType(prev => (prev === 'back' ? 'front' : 'back'));

  const takePhoto = async () => {
    if (cameraRef.current && !isRecording) {
      const photo = await cameraRef.current.takePictureAsync();
      setRecordType('photo');
      setRecordedUri(photo.uri);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({ maxDuration: 120 });
      if (video) setRecordedUri(video.uri);
      setRecordType('video');
      setIsRecording(false);
    }
  };

  const handlePressIn = () => {
    pressTimer.current = setTimeout(() => {
      startRecording();
    }, 300); // ضغط طويل يبدأ التسجيل
  };

  const handlePressOut = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (isRecording) stopRecording();
    else takePhoto();
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  if (recordedUri && !uploadingPage) {
    return (
      <View style={styles.previewContainer}>
        {recordType == 'video' ?(
            <Video
          source={{ uri: recordedUri }}
          style={styles.preview}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />
        ):(
            <Image
          source={{ uri: recordedUri }}
          style={styles.preview}
        

        />
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => {
            setRecordedUri(null);
            setTitle('')
        }}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.nextButton , { backgroundColor:Colors.dark.minColor}]} onPress={() => setUploadingPage(true)}>
          <Text style={{color:'white',fontSize:17}}>التالي</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if(recordedUri &&uploadingPage){
    return (
       <View style={{
        height:'100%',
        width:'100%',
        marginTop:45
       }}> 
       <View>
        <TouchableOpacity style={{marginLeft:15}}>
            <Ionicons name="chevron-back" size={24} color={"white"} onPress={() => setUploadingPage(false)}/>
        </TouchableOpacity>
       </View>
        <View style={{
            width:'100%',
            marginTop:20,
            paddingHorizontal:20,
            paddingVertical:12,
            backgroundColor :'#1a1a1aff',
            flexDirection:'row-reverse'
        }}>
             <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={140}
                            placeholder="  وصف المنشور..."
                            placeholderTextColor="#a1a1a1c5"
                            onChangeText={(text) => setTitle(text)}
                            value={title}
                            style={{
                                height: 100,
                                flex:1,
                                borderRadius: 18,
                                paddingHorizontal: 15,
                                backgroundColor:'transparent',
                                paddingVertical: 10,
                                textAlign:'right',
                                textAlignVertical : 'top',
                                color:'#ffffff',
                                lineHeight:18,
                                fontFamily : 'Tajawal',
                                marginLeft:5,
                                fontSize:16
                            }}
                        />
        {
            recordType == 'video' ? (
        <Video
          source={{ uri: recordedUri }}
          style={{
            width:100,
            height:100,
            borderWidth:2,
            borderColor:'white',
            padding:2,
            borderRadius:3
          }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
        />
            ) : (
               <Image  
                 source={{ uri: recordedUri }}
                  style={{
            width:100,
            height:100,
            borderWidth:2,
            borderColor:'white',
            padding:2,
            borderRadius:3
          }}
                 />
            )
        }
        </View>
       </View>
    )
  }
  // 🖼️ اختيار صورة أو فيديو من الأستوديو
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
     if(result?.assets[0]?.type)
      setRecordType(result?.assets[0]?.type)
      setRecordedUri(result.assets[0].uri);
    }
  };
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} mode="video" />
      <TouchableOpacity style={styles.backButton} onPress={() => {
            router.back();
        }}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      {selectedFilter !== 'none' && (
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: filters.find(f => f.id === selectedFilter)?.color || 'transparent' }]}
        />
      )}

      <View style={styles.sideControls}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="color-filter-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType} style={styles.iconButton}>
          <Ionicons name="camera-reverse-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={{marginLeft:-50}} onPress={pickFromGallery}>
            <Ionicons name="image" size={30} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.captureButton, isRecording && { backgroundColor: 'red' }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </View>

      <View style={styles.filterBar}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.filterButton, selectedFilter === item.id && styles.selectedFilter]} onPress={() => setSelectedFilter(item.id)}>
              <View style={[styles.filterPreview, { backgroundColor: item.color }]} />
              <Text style={styles.filterText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  controls: {
       position: 'absolute',
       bottom: 120,
       width: '100%',
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       gap: 15
     },
  iconButton: {
    backgroundColor: '#00000080',
    padding: 8,
    borderRadius: 30 },
  captureButton: {
     width: 80,
     height: 80, 
     borderRadius: 50,
     backgroundColor: '#fff',
     borderWidth: 4,
     borderColor: '#ff006a'
 },
  previewContainer: { flex: 1, backgroundColor: 'black' },
  preview: { flex: 1 },

  backButton: {
     position: 'absolute',
     top: 45,
     left: 20,
     zIndex:22
 },
  nextButton:{
     position: 'absolute',
     top: 45,
     right: 25,
     paddingHorizontal:25,
     paddingVertical:6,
     borderRadius:4,
     zIndex:22
    
 },
  center: {
     flex: 1,
     justifyContent: 'center', 
     alignItems: 'center',
     backgroundColor: 'black'
 },
  sideControls: {
      position: 'absolute',
     right: 15, 
     top: 40, 
     gap: 10 
},
  filterBar: {
     position: 'absolute', 
     bottom: 20, 
     width: '100%', 
     alignItems: 'center',
     
 },
  filterButton: {
     alignItems: 'center',
     marginHorizontal: 8 
},
  filterPreview: { 
     width: 40,
     height: 40, 
     borderRadius: 10, 
     borderWidth: 1, 
     borderColor: '#fff'
 },
  selectedFilter: { transform: [{ scale: 1.2 }] },
  filterText: { color: 'white', fontSize: 12, marginTop: 4 },
});
