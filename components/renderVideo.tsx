import Colors from "@/constants/Colors";
import { ResizeMode, Video } from "expo-av";
import { Dimensions, TouchableOpacity, useColorScheme } from "react-native";

  
  
  export function RenderVideo(item: any , index : number , ViewVideo : (item : any , index : number)=> void ){
      const screenWidth = Dimensions.get('window').width;
    const numColumns = 3;
    const itemSize = screenWidth / numColumns;
    const colorScheme  = useColorScheme();
    return (
        <TouchableOpacity style={{ width: itemSize, height: itemSize * 1.5 }} activeOpacity={0.6} onPress={()=> ViewVideo(item.id , index)}>
      <Video
        source={{ uri: item.url }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: colorScheme == 'dark' ? Colors.dark.background : Colors.light.background,
          borderWidth : 2,
          borderColor:'red'
        }}
      />
    </TouchableOpacity>
    )
  }