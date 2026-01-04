import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  useColorScheme,
  View as RNView,
  Platform,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import useAuthGuard from '@/hooks/useAuthGuard';
import Color from '../../constants/Colors';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import SideMenu from '@/components/sideMenu';

const videos = [
 { id: '3', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v5.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz'},
    { id: '4', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v1.mp4', uid: '579ba169-6e6d-4901-a8b7-022e83e6d188' , username : 'tow'},
    { id: '5', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v3.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz'},
    { id: '6', url: 'https://pjapftmwlydgxglchncd.supabase.co/storage/v1/object/public/shakomako/posts/videos/v2.mp4', uid: 'eb986561-9186-4dd9-9e33-40568b90702f' , username : 'mo_nxz2'},
];

export default function ProfileScreen({ userId }: { userId?: any }) {
  const { user, loading } = useAuthGuard(userId);
  const navigation = useNavigation();
  const router = useRouter();

  const route = useRoute();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const highlightIcon = colorScheme === 'dark' ? '#858585ff' : '#999999ff';
  const bg = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const itemSize = screenWidth / numColumns;
  const pagerRef = useRef<PagerView>(null);
  const [tab, setTab] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  // Animated value مشترك يرسل من كل FlatList
  const scrollY = useRef(new Animated.Value(0)).current;

  // ثوابت الارتفاع — عدّلها لو تحب
  const HEADER_FULL_HEIGHT = 400; // ارتفاع الهيدر الكامل الذي سيختفي تدريجياً (بما فيه الصورة والوصف)
  const TAB_HEIGHT = Platform.OS == 'ios' ? 124 : 62; // ارتفاع شريط التابات
  const STICKY_THRESHOLD = HEADER_FULL_HEIGHT - TAB_HEIGHT - 10; // النقطة التي بعد الوصول إليها تظهر النسخة الثابتة
  const flastListContentTop = Platform.OS == 'android' ? 65 : 5;

  // حركة الهيدر (الصورة + البيانات + التابات الأصلية تتحرك كلها معاً)
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_FULL_HEIGHT ],
    outputRange: [0, -HEADER_FULL_HEIGHT ],
    extrapolate: 'clamp',
  });

  // شفافية النسخة الثابتة من التابات (تظهر تدريجياً بعد العتبة)
  const stickyTabsOpacity = scrollY.interpolate({
    inputRange: [STICKY_THRESHOLD - 3, STICKY_THRESHOLD + 3],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nameOpacity = scrollY.interpolate({
    inputRange: [STICKY_THRESHOLD - 40, STICKY_THRESHOLD + 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  let canPress = true;
  

  const ViewVideo = (videoId : string , index : number)=>{
      if (!canPress) return;
      canPress = false;
       router.push({
    pathname: '../../profileVideos',
    params: {
      type: 'profile',
      startIndex: String(index), // stringify to be safe
       videos: JSON.stringify(videos) // لو مصمم تمرر المصفوفة، قم بتسلسلها
    },
  });
  setTimeout(() => { canPress = true; }, 1500); // 1 ثانية تأخير
  }
  const renderVideo = (item: any , index : number) => (
    <TouchableOpacity style={{ width: itemSize, height: itemSize * 1.5 }} activeOpacity={0.6} onPress={()=> ViewVideo(item.id , index)}>
      <Video
        source={{ uri: item.url }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: colorScheme == 'dark' ? Color.dark.background : Color.light.background,
          borderWidth : 2,
          borderColor:'red'
        }}
      />
    </TouchableOpacity>
  );

  const handleTabChange = (index: number) => {
    setTab(index);
    pagerRef.current?.setPage(index);
  };

  if (loading) return <Text>Loading</Text>;

  return (
    <View style={styles.container}>
      {/* ======= الهيدر المتحرك (يشمل الصورة + البيانات + التابات الأصلية) ======= */}
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            transform: [{ translateY: headerTranslateY }],
            // خلفية سوداء عشان تختفي العناصر فوق المحتوى
            backgroundColor: bg,
          },
        ]}
      >
        {/* صورة وبيانات */}
        <RNView style={{ alignItems: 'center', marginTop: 95 }}>
          <Image
            source={{ uri: user?.avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: '#fff',
              objectFit: 'cover',
            }}
          />
        </RNView>

        <RNView style={{ marginTop: 10, alignItems: 'center' }}>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 19, fontWeight: 'bold' }}>{user?.name}</Text>
          </RNView>
         
         <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>@{user?.username}</Text>

        </RNView>

        <RNView style={{ flexDirection: 'row', marginTop: 15, gap: 15, width: '100%', justifyContent: 'center' , alignItems : 'center'}}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between', 
            width:270
          }}> 
            <RNView style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>150</Text>
            <Text style={{ fontSize: 14, color: 'gray' ,paddingVertical :3}}>المتابعين</Text>
          </RNView>
          <RNView style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>200</Text>
            <Text style={{ fontSize: 14, color: 'gray' ,paddingVertical :3}}>يتابع</Text>
          </RNView>
          <RNView style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>50</Text>
            <Text style={{ fontSize: 14, color: 'gray' ,paddingVertical :3}}>الإعجابات</Text>
          </RNView>
          </View>
        </RNView>

        <Text style={{ fontSize: 14, color: 'gray', marginTop: 24, alignSelf: 'center' }}>
          وصف الملف الشخصي هنا
        </Text>

        {/* التابات الأصلية (هذه تتحرك مع الهيدر) */}
        <RNView style={styles.tabsInline}>
          <TouchableOpacity onPress={() => handleTabChange(0)} style={tab === 0 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="grid" size={20} color={tab === 0 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(1)} style={tab === 1 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="repeat" size={20} color={tab === 1 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(2)} style={tab === 2 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="bookmark" size={20} color={tab === 2 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(3)} style={tab === 3 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="heart" size={20} color={tab === 3 ? iconColor : highlightIcon} />
          </TouchableOpacity>
        </RNView>
      </Animated.View>

      {/* ======= النسخة الثابتة من التابات (تظهر عندما يختفي القسم العلوي) ======= */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyTabs,
          {
            opacity: stickyTabsOpacity,
          },
        ]}
      >
        <RNView style={[styles.stickyTabsInner , {backgroundColor:bg}]}>
           <Animated.View style={{
            alignItems:'center',
            justifyContent:'center',
            position: 'absolute',
            top:30 ,
            opacity : nameOpacity
           }}>
            <Text style={{ fontSize: 19, fontWeight: 'bold' ,}}> {user?.name} </Text>
          </Animated.View>
          <TouchableOpacity onPress={() => handleTabChange(0)} style={tab === 0 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="grid" size={20} color={tab === 0 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(1)} style={tab === 1 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="repeat" size={20} color={tab === 1 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(2)} style={tab === 2 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="bookmark" size={20} color={tab === 2 ? iconColor : highlightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabChange(3)} style={tab === 3 ? [styles.activeTab ,{borderBottomColor: iconColor,}] : styles.tab}>
            <Feather name="heart" size={20} color={tab === 3 ? iconColor : highlightIcon} />
          </TouchableOpacity>
        </RNView>
      </Animated.View>

      {/* ======= PagerView مع FlatList قابلة للتمرير في كل تبويب ======= */}
      <PagerView ref={pagerRef} style={{ flex: 1 }} initialPage={0} onPageSelected={(e) => setTab(e.nativeEvent.position)}>
        
          <RNView key={1} style={{ flex: 1 }}>
            <Animated.FlatList
              data={videos}
              renderItem={({ item , index }) => renderVideo(item , index)}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              contentContainerStyle={{ paddingTop: HEADER_FULL_HEIGHT + flastListContentTop }} // يترك مساحة للهيدر المتحرك
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            />
          </RNView>


          <RNView key={2} style={{ flex: 1 }}>
          
          </RNView>


          <RNView key={3} style={{ flex: 1 }}>
           
          </RNView>


          <RNView key={4} style={{ flex: 1 }}>
          
          </RNView>
    
      </PagerView>

      {/* ======= أزرار أعلى الشاشة الثابتة (سهم، share، menu) ======= */}
      <RNView style={styles.topButtons}>
        {route.name !== 'profile' && userId ? (
          <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={30} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Feather name="user-plus" size={25} color={iconColor} />
          </TouchableOpacity>
        )}
        <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {route.name === 'profile' && !userId && (
            <TouchableOpacity onPress={()=>{
              router.push('/modal');
            }}>
              <Ionicons name="footsteps-outline" size={25} color={iconColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={26} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu-outline" size={30} color={iconColor} />
          </TouchableOpacity>
        </RNView>
      </RNView>
       <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // الهيدر المتحرك يغطي الجزء العلوي كاملاً (الصورة + البيانات + التابات الأصلية)
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingBottom: 8,
  },

  // التابات المدمجة داخل الهيدر (تتحرك مع الهيدر)
  tabsInline: {
    marginTop: 18,
    width: '100%',
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 0.25,
    borderBottomColor: '#7a7a7a67',
    paddingBottom : 10,
    alignItems: 'center',
    height: 47, // سيستخدم الثابت المُعرف أعلاه
  },

  // النسخة الثابتة من التابات التي تظهر على رأس الشاشة بعد التحريك
  stickyTabs: {
    position: 'absolute',
    paddingBottom : 10,
    top: 0, // تحت أزرار الـ top الثابتة
    left: 0,
    right: 0,
    zIndex: 8,
    // pointerEvents: 'box-none' حتى تسمح بالضغط على التابات
  },
  stickyTabsInner: {
    width: '100%',
    height: 132,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderBottomWidth: 0.25,
    borderBottomColor: '#7a7a7a67',
    paddingBottom : 10
  },

  // أزرار التابات
  tab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    width: 45,
    alignItems: 'center',
  },
  activeTab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    width: 45,
    alignItems: 'center',
  },

  // أزرار أعلى الشاشة الثابتة
  topButtons: {
    position: 'absolute',
    left: 0,
    top: 35,
    right: 0,
    paddingHorizontal: 15,
    zIndex: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

