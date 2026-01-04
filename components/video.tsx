import React, { useState } from 'react';
import { Text } from '@/components/Themed';
import { Video, ResizeMode } from 'expo-av';
import { View, Dimensions, Image, useColorScheme, Pressable, Platform, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useRouter , router } from 'expo-router';

export function PostVideo({
  item,
  isViewable,
  showComments,
  isActiveTab
}: {
  item : any
  isViewable?: boolean;
  showComments: (id : string) => void;
  isActiveTab: boolean;
}) {
  const videoRef = React.useRef<Video>(null);
  const router = useRouter();
  const route = useRoute()
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const [isPaused, setIsPaused] = React.useState(false);
  const [Liked , setLiked] = useState(false);
  const [likes , setLikes] = useState(2);
   
  const handlePauseVideo = async () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <>
      <View style={{ position: 'relative', backgroundColor: '#000' }}>
        <Pressable onPress={handlePauseVideo}>
          <Video
            ref={videoRef}
            source={{ uri: item?.url }}
            style={{
              width: '100%',
              height: Dimensions.get('window').height,
              backgroundColor: colorScheme === 'dark' ? '#000' : '#000',
            }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={isFocused && isViewable && !isPaused && isActiveTab}
            isLooping
            onError={(e) => console.log('🎬 Video error:', e)}
          />
        </Pressable>
      </View>

      {/* الواجهة الجانبية */}
      <Pressable onPress={handlePauseVideo} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View
        style={{
          position: 'absolute',
          zIndex: 55,
          bottom: Platform.OS == 'ios' ? 80 : 30,
          right: 20,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          gap: 26,
        }}
      >
        
        <View>
          <TouchableOpacity onPress={()=> {
            setLiked(!Liked);
            if(Liked){
              setLikes((prev) => prev - 1)
            }else{
              setLikes((prev) => prev + 1)

            }
          }}>
            <FontAwesome name="heart" size={35} color={Liked ? "red" : "white" }/>
          </TouchableOpacity>
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 7, fontWeight: 'bold' }}>{likes}</Text>
        </View>
        <View>
          <FontAwesome name="commenting" size={35} color="white" onPress={() => showComments(item?.id)} />
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 7, fontWeight: 'bold' }}>2.8k</Text>
        </View>
        <View>
          <FontAwesome name="bookmark" size={35} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 7, fontWeight: 'bold' }}>984</Text>
        </View>
        <View>
          <Ionicons name="arrow-redo" size={35} color="white" />
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 7, fontWeight: 'bold' }}>984</Text>
        </View>

        {/* صورة الحساب */}
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'flex-end',
              marginRight: 10,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{item?.username}</Text>
            <Text style={{ color: '#fff', marginTop: 5, fontSize: 15 }}>العنوان هنا</Text>
          </View>

          <Pressable onPress={() => {
           if(route.name == 'index'){
            router.push(`../profile/${item?.uid}`)
           }else{
            router.back();
           }
           
          }}>
            <Image
              source={require('../assets/images/moamal.png')}
              style={{ width: 60, height: 60, borderRadius: 55, marginRight: -15, resizeMode: 'cover' }}
            />
          </Pressable>

          <View
            style={{
              position: 'absolute',
              backgroundColor: '#00d4f0',
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              bottom: -8,
              right: 1,
            }}
          >
            <Ionicons name="add" size={17} color="white" />
          </View>
        </View>
        
      </View>
      </Pressable>
    </>
  );
}
