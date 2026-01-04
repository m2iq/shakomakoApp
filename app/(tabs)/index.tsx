import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, Dimensions, useColorScheme , TextInput, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import { Text, View } from '@/components/Themed';
import { PostVideo } from '../../components/video';
import Colors from '@/constants/Colors';
import PagerView from 'react-native-pager-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommentsOverlay from '@/components/commentsOverlay';
import { useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function TabOneScreen() {
  
  const colorScheme = useColorScheme();
  const pagerRef = useRef<PagerView>(null);
  const [tab, setTab] = useState(0); // 0 = لك, 1 = أتابعه
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [actionIndexForYou, setActionIndexForYou] = useState<string | null>(null);
  const [actionIndexFollowing, setActionIndexFollowing] = useState<string | null>(null);
  
  var videosForYou = [
    { id: '3', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v5.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz'},
    { id: '4', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v1.mp4', uid: '579ba169-6e6d-4901-a8b7-022e83e6d188' , username : 'tow'},
    { id: '5', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v3.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz'},
    { id: '6', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v2.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz2'},
  ];

  const videosFollowing = [
    { id: '1', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v4.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz'},
    { id: '2', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v6.mp4', uid: '579ba169-6e6d-4901-a8b7-022e83e6d188' , username : 'tow'},
  ];
 
  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };
   
  const onViewableItemsChangedForYou = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActionIndexForYou(viewableItems[0].item.id);
  }).current;

  const onViewableItemsChangedFollowing = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActionIndexFollowing(viewableItems[0].item.id);
  }).current;

  const renderVideo = (item: any, isForYou: boolean) => (
    <PostVideo
      key={item.id}
      item={item}
      isViewable={
        isForYou
          ? actionIndexForYou === item.id
          : actionIndexFollowing === item.id
      }
      isActiveTab={isForYou ? tab === 0 : tab === 1} 
      showComments={(id) => showComments({id})}
    />
  );
  
  const showComments = ({id} : {id : string})=>{
        alert('show : '+id)
        setShowCommentsSection(true)
  }

  const handleTabChange = (index: number) => {
    setTab(index);
    pagerRef.current?.setPage(index);
  };
  
  return (
    <View style={styles.container}>

      {/* ✅ PagerView */}
      {
       
          <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setTab(e.nativeEvent.position)}
      >
        {/* صفحة "لك" */}
        <View key="1">
          <FlatList
            data={videosForYou}
            renderItem={({ item }) => renderVideo(item, true)}
            keyExtractor={(item) => item.id}
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').height}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChangedForYou}
            viewabilityConfig={viewabilityConfig}
            style={{ backgroundColor: Colors.dark.background }}
          />
        </View>

        {/* صفحة "أتابعه" */}
        <View key="2">
          <FlatList
            data={videosFollowing}
            renderItem={({ item }) => renderVideo(item, false)}
            keyExtractor={(item) => item.id}
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').height}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChangedFollowing}
            viewabilityConfig={viewabilityConfig}
            style={{ backgroundColor: Colors.dark.background }}
          />
        </View>
      </PagerView>
      }

      {/* ✅ شريط التنقل */}
      <View style={styles.topTabs}>
        <Text
          style={[styles.tabText, { opacity: tab === 0 ? 1 : 0.3 }]}
          onPress={() => handleTabChange(0)}
        >
          لك
        </Text>
        <Text
          style={[styles.tabText, { opacity: tab === 1 ? 1 : 0.3, marginLeft: 20 }]}
          onPress={() => handleTabChange(1)}
        >
          أتابعه
        </Text>
      </View>

      {/* ✅ شعار */}
      <View style={styles.logo}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.dark.minColor, marginHorizontal:6 }}>ماكو</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>شكو</Text>
      </View>
      <View style={styles.addPostIcon}>
        <TouchableOpacity activeOpacity={0.4} onPress={()=> router.push('/camera')}>
          <Ionicons name='add-circle' size={35} color={'white'} />
        </TouchableOpacity>
      </View>

      {/* ✅ نافذة التعليقات */}
     {showCommentsSection && (
     <CommentsOverlay tabBar={true} showCommentsSection={showCommentsSection} setShowCommentsSection={setShowCommentsSection} />
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topTabs: {
    position: 'absolute',
    zIndex: 24,
    top: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor:'rgb(0,0,0,0)'
  },
  tabText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  logo: {
    position: 'absolute',
    zIndex: 24,
    top: 45,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'rgba(255, 255, 255, 0)'
  },
  commentsSection: {
    position: 'absolute',
    flex: 1,
    width: Dimensions.get('window').width * 0.96,
    height: Dimensions.get('window').height * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    borderRadius: 15,
    zIndex: 55,
    right: Dimensions.get('window').width * 0.02,
  },
  addPostIcon:{
    position: 'absolute',
    backgroundColor:'transpernt',
    zIndex: 24,
    top: 40,
    left: 20,
  }
});
