import { View, Text, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { PostVideo } from '@/components/video';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CommentsOverlay from '@/components/commentsOverlay';
import { useRouter } from 'expo-router';


export default function ReelsScreen() {
  const route = useRoute();
  const router = useRouter();
  const { videos, startIndex } = route.params as any;
  const userVideos = JSON.parse(videos);
  const [activeIndex, setActiveIndex] = useState<number>(startIndex || 0);
  const [showCommentsSection , setShowCommentsSection] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    // لما تفتح الصفحة، تروح مباشرة على الفيديو المطلوب
    if (flatListRef.current && startIndex >= 0) {
      flatListRef.current.scrollToIndex({ index: startIndex, animated: false });
    }
  }, [startIndex]);

  // 🔹 تعريف العناصر الظاهرة
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setActiveIndex(index);
    }
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 70 };

  // 🔹 دالة عرض الفيديوهات
  const renderVideo = ({ item, index }: any) => (
    <PostVideo
      key={item.id}
      item={item}
      isViewable={index == activeIndex}
      isActiveTab={true}
      showComments={(id) => setShowCommentsSection(true)}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{
        position: 'absolute',
        top:35,
        zIndex:3
      }}>
        <TouchableOpacity style={{marginLeft:20}} onPress={()=> router.back()}>
          <Ionicons name='chevron-back' size={24} color={'white'} ></Ionicons>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={userVideos}
        renderItem={({ item , index }) => renderVideo({item , index})}
        keyExtractor={(item) => item.id}
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').height,
          offset: Dimensions.get('window').height * index,
          index,
        })}
        style={{ backgroundColor: Colors.dark.background }}
      />
      
        {showCommentsSection && (
           <CommentsOverlay tabBar={false} showCommentsSection={showCommentsSection} setShowCommentsSection={setShowCommentsSection} />
      )}
    </View>
  );
}
