import { TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from '@/components/useColorScheme';
import CommentsOverlay from './commentsOverlay'
import { useState } from "react";
interface PostFooterProps {
    p: any; 
    showCommentsSection: boolean;
    setShowCommentsSection: (value: boolean) => void;
    comid: (id : string) => void;
}
export default function PostFooter({p, showCommentsSection , setShowCommentsSection , comid}: PostFooterProps) {
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
    const post = p?.post || p;
  
    const showComments = ()=>{
        setShowCommentsSection(true);
        comid(post.post_id);
    }
    return (
        <View>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:10,gap:15 , marginTop:30}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={{opacity:0.5}}>
                    مشاركات 
                   </Text>
                    <Text style={{opacity:0.6}}>
                        --
                    </Text>
                </View>


                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={{opacity:0.5}}>
                    اعادة النشر
                     </Text>
                    <Text style={{opacity:0.6}}>
                        --
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={{opacity:0.5}}>
                    تعليقات
                     </Text>
                    <Text style={{opacity:0.6}}>
                        {post.comment_count}
                    </Text>
                </View>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={{opacity:0.5}}>
                    إعجابات
                     </Text>
                    <Text style={{opacity:0.6}}>
                         {post.like_count}
                    </Text>
                </View>

                

            </View>

            <View style={{ flexDirection:'row' , justifyContent:'space-around' ,height:62,marginBottom:-20}}>
                <TouchableOpacity
                    style={{ width:30 , height:40 , alignItems:'center' , justifyContent:'center' , borderRadius:15 }}
                >
                <Ionicons name="arrow-undo-outline" size={26} color={iconColor} />
                </TouchableOpacity>

               <TouchableOpacity
                    style={{ width:30 , height:40 , alignItems:'center' , justifyContent:'center' , borderRadius:15 }}
                >
                <Feather name="repeat" size={26} color={iconColor} />
                </TouchableOpacity> 

                <TouchableOpacity
                    style={{ width:30 , height:40 , alignItems:'center' , justifyContent:'center' , borderRadius:15 }}
                    onPress={()=> showComments()}
                >
                <Ionicons name="chatbubble-outline" size={26}  color={iconColor} />
                </TouchableOpacity>  
               
                <TouchableOpacity
                    style={{ width:30 , height:40 , alignItems:'center' , justifyContent:'center' , borderRadius:15 }}
                >
                <Feather name="heart" size={26} color={iconColor} />
                </TouchableOpacity>                 
            </View>
            
        </View>
    );
}