import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Keyboard,
  Animated,
  ScrollView,
  Platform,
  Touchable,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;

export default function CommentsOverlay({tabBar = true ,showCommentsSection, setShowCommentsSection } : {tabBar : boolean, showCommentsSection: boolean; setShowCommentsSection: (value: boolean) => void }) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const colorScheme =  useColorScheme();
  const alphaBg = colorScheme == 'dark' ? Colors.dark.backgroundAhlpa : Colors.light.backgroundAhlpa;
 

  useEffect(() => {
   
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(animatedHeight, {
        toValue: e.endCoordinates.height - (tabBar ? Platform.OS === 'ios' ? 65 : 45 : 5),
        duration: 150,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (!showCommentsSection) return null;
  
  return (
    <>
      {/* الخلفية */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: screenHeight,
          backgroundColor: 'rgba(0,0,0,0)',
          zIndex: 0,
        }}
        onTouchEnd={()=> setShowCommentsSection(false)}
      ></View>

      {/* نافذة التعليقات */}
      
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: screenHeight * 0.75,
          backgroundColor: alphaBg || '#111',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingTop: 10,
        }}
      >
        {/* قائمة التعليقات */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingBottom: 80 }} // مساحة لـ Input
        >
          <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#fff' }}>التعليقات</Text>
          {[...Array(15).keys()].map(i => (
            <Text key={i} style={{ color: '#fff', marginVertical: 5 }}>تعليق {i+1}</Text>
          ))}
        </ScrollView>
        <SafeAreaView style={{
        paddingBottom:tabBar ? - 65 : 0
      }}>
        {/* حقل الكتابة ثابت أسفل النافذة */}
        <Animated.View style={{zIndex:222, padding: 0, marginBottom: animatedHeight }}>
          <View style={{
            width: '100%',
             backgroundColor: 'rgba(136, 136, 136, 0)' ,
             height:130 ,
             alignItems:'center',
             justifyContent:'center' ,
             borderTopWidth:1 ,
             borderTopColor:'rgba(134, 134, 134, 0.1)',
             flexDirection:'column',
             }}>
            
            <View style={{
             width: '98%',
             backgroundColor: 'rgba(136, 136, 136, 0)' ,
             justifyContent:'center' ,
             flexDirection:'row-reverse',
             marginTop:20
            }}>
                <Image source={require('../assets/images/moamal.png')} style={{width : 40, height : 40 ,borderRadius:40 , marginHorizontal:10}}/>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={140}
                placeholder="اكتب تعليقك هنا..."
                placeholderTextColor="#858585c5"
                style={{
                    height: 65,
                    width:'100%',
                    flex:1,
                    borderRadius: 18,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: colorScheme == 'dark' ? Colors.dark.highlight : Colors.light.highlight,
                    color: colorScheme == 'dark' ? Colors.dark.text : Colors.light.text,
                    textAlign:'right',
                    textAlignVertical : 'top',
                    lineHeight:18,
                    fontFamily : 'Tajawal'
                }}
            />
            </View>
        <View style={{
            flexDirection: 'row',
            justifyContent:'space-between',
            width:'100%',
            paddingHorizontal:'2%',
            marginTop : 15,
            marginBottom: 20,
        }}>
            
              <View style={{flexDirection: 'row',gap:10}}>
                <Ionicons name="image-outline" size={24} color="#ffffffff" style={{ }} onPress={() => setShowCommentsSection(false)} />
                <Ionicons name="at-outline" size={24} color="#ffffffff" style={{ }} onPress={() => setShowCommentsSection(false)} />
                <Ionicons name="happy-outline" size={24} color="#ffffffff" style={{ }} onPress={() => setShowCommentsSection(false)} />
                    
              </View>
              
              <TouchableOpacity style={{
                backgroundColor:colorScheme == 'dark' ? Colors.dark.minColor : Colors.light.minColor,
                width : 45,
                height:28,
                alignItems:'center',
                justifyContent:'center',
                borderRadius : 10,
                 
            }}>
                <Ionicons name="arrow-up" size={18} color="#ffffffff" style={{}} />
            </TouchableOpacity>
        </View>
            </View>
        </Animated.View>
        </SafeAreaView>
      </View>
     
    </>
  );
}
