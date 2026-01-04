import { Dimensions, Image } from "react-native";
import { View , Text} from "./Themed"; 
import { useEffect, useState } from "react";
import PostFooter from "./postFooter";
import { setFormatTime} from "./formatTime";
import { ResizeMode, Video } from "expo-av";
export default function PostView({post}: {post: any}) {
      const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
      const screenWidth = Dimensions.get('window').width;
      const ProjectId = 'znpvmbsnrpdwortyoukn';
      
    useEffect(() => {
    if(post.type !== 'image') return;
    Image.getSize(
      post.src,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => {
        console.log('Error loading image', error);
      }
    );
  }, [post.src]);
   const calculatedHeight = (screenWidth* imageSize.height) / imageSize.width * 0.5;
    return (
        <View style={{position:'relative',overflow:'hidden', flexDirection: 'column', alignItems:'flex-end', ...styles.postContainer }}>
          <View style={{
            height : '90%',
            position:'absolute',
            right:36,
            top:95,
            width : 2,
            backgroundColor:'rgba(116, 116, 116, 0.29)'
          }}></View>
            <View style={{width:'100%', ...styles.postHeader}}>
               <View style={{ flexDirection: 'row-reverse', alignItems: 'center' ,backgroundColor:'transparent'}}>
                 <Image 
                source={post?.users.avatar == '/images/avatar.png' ? require('../assets/images/moamal.png') :{ uri : `https://${ProjectId}.supabase.co/storage/v1/object/public/shakomako/avatars/`+post.users.avatar}}
                style={{ width: 60, height: 60, borderRadius: 60, margin: 10 , resizeMode: 'cover' }}
                />
                <View style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', marginRight:10 ,backgroundColor:'transparent'}}>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end' ,gap:5 , backgroundColor : "transparent" }}>
                      <Text style={{  fontWeight: 'bold' ,fontSize : 19 ,marginTop:3}}>{post.users.username}</Text>
                      <Text style={{ margin:2}}>{
                          post.upload_in_country_city == 'false' ?
                          post.users.username
                          :  post.upload_in_country_city
                    }</Text>
                   </View>
                   <Text style={{fontSize:14,  marginTop: 10 , marginLeft:20 , color:'rgba(116, 116, 116, 0.84)'}}>
                    {setFormatTime(post.post_time).time} 
                    <Text style={{ color:'rgba(116, 116, 116, 0.82)'}}> {setFormatTime(post.post_time).text} </Text>
                   </Text>
                </View>
               
               </View>
            </View>

          
            {
                post?.post_src.includes('image') ? (
                    <Image
                    source={{ uri: `https://${ProjectId}.supabase.co/storage/v1/object/public/shakomako/posts/images/`+post.post_src }}
                    width={imageSize.width}
                    height={calculatedHeight}
                    style={{width : '85%',right:55, ...styles.postImage}}
                    />
                ) :  post?.post_src.includes('video')
                 ? 
                 <Video
                   resizeMode={ResizeMode.CONTAIN} 
                     source={{ uri: `https://${ProjectId}.supabase.co/storage/v1/object/public/shakomako/posts/videos/`+post.post_src }}
                 />
                  : post?.post_src.includes('audio') 
                  ? <Text>AUdio</Text> :
                  post?.post_src == 'text' ?
                 <Text
             style={[styles.postConTent , { textAlign: 'right', maxWidth:'83%'}]}
     
             >{post.title}</Text> : ''
            }

         <PostFooter post={post}/>
        </View>
    );
}
const styles = {
    postContainer: {
        marginVertical: 5,
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.95,
        maxWidth: 500,
        marginTop: 10,
        borderWidth: 0.3,
        borderColor: '#8080806c',
        paddingBottom: 15,
    },
    postHeader: {
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    postConTent: {
        lineHeight: 29,
        marginTop: 5,
        marginRight: 60, 
        fontSize:15,
      
    },
    postImage: {
        marginTop: 15,
        borderRadius: 15,
    },

   
};