import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput , StyleSheet, useColorScheme, TouchableOpacity, ActivityIndicator, ScrollView} from "react-native";
import { SignInWithGoogle , listenToAuthChanges , checkAuth} from "./authActions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const [loading , setLoading] = useState<boolean>(false);
    const colorScheme = useColorScheme();
    const router = useRouter();
    const colorText = colorScheme == 'dark' ? Colors.dark.text : Colors.light.text;
    const minColor = colorScheme == 'dark' ? Colors.dark.minColor : Colors.light.minColor;
    const colorBGAlpha = colorScheme == 'dark' ? Colors.dark.backgroundAhlpa : Colors.light.backgroundAhlpa;
    const bg = colorScheme == 'dark' ? Colors.dark.background: Colors.light.background;


    const [inputFocused , setInputFocused] = useState<any>({
        email : false,
        pass : false ,
        username : false
    });
   
    useEffect(() => {
  const unsubscribe = listenToAuthChanges(router);
  const checkAuthUser = checkAuth(router);
  return () => {
    unsubscribe();
  }
}, []);

    return (
        
      <SafeAreaView style={{ flex: 1, backgroundColor: bg , padding:10}}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}>
           <View style={{alignItems:'center' , justifyContent:'flex-start' ,flexDirection : 'row-reverse',gap:5 , marginBottom : 100}}>
            <Text style={{color : colorText , fontSize : 24 , fontWeight : 'bold'}}> انشاء حساب في <Ionicons name="chevron-back" size={17}/> </Text>

            <Text style={{color : colorText , fontSize : 24 , fontWeight : 'bold'}}>شكو</Text>
            <Text style={{color : minColor , fontSize : 24 , fontWeight : 'bold'}}>ماكو</Text>
           </View>
            <View>

                <TextInput style={[styles.input , {
                color : colorText,
                borderBottomColor : inputFocused.email ? Colors.light.minColor : '#7a7a7a67'
            }]} 
            placeholder="البريد الأكتروني" onBlur={()=> setInputFocused({email : false})} onFocus={(e)=> setInputFocused({email : true})}/>
            
            
            <TextInput style={[styles.input , {
                color : colorText,
                borderBottomColor : inputFocused.username ? Colors.light.minColor : '#7a7a7a67'
            }]} 
            placeholder="اسم المستخدم"  onBlur={()=> setInputFocused({username : false})} onFocus={(e)=> setInputFocused({username : true})} />


              <TextInput style={[styles.input , {
                color : colorText,
                borderBottomColor : inputFocused.pass ? Colors.light.minColor : '#7a7a7a67'
            }]} 
            placeholder="كلمة المرور"  onBlur={()=> setInputFocused({pass : false})} onFocus={(e)=> setInputFocused({pass : true})}/>

            <TouchableOpacity
             onPress={()=> {
                setLoading(true);
                setTimeout(()=>{
                    setLoading(false)
                },3000)
             }}
             style={{alignItems : 'center' , justifyContent : 'center' , flexDirection: 'row' , height : 40 ,backgroundColor : loading ? colorBGAlpha : minColor ,padding : 5 , borderRadius : 5 ,marginTop : 30}}
             disabled={loading}
             >
              <Text style={{color : colorText , marginHorizontal : 5 , fontSize : 17 , bottom : -2 , fontWeight : '400'}}> تسجيل </Text>
              {loading 
               && ( <ActivityIndicator />)
             }
                
               
            
            </TouchableOpacity>
           
           
            </View>
            <Text style={{marginVertical : 40, fontSize : 18 , opacity: 0.5,}}>----- او -----</Text>
            <View style={{width : 350,gap:15}}>
                <TouchableOpacity onPress={()=> SignInWithGoogle(router)} style={{alignItems : 'center' , justifyContent : 'center' , flexDirection: 'row' , height : 45 ,backgroundColor :colorBGAlpha,padding : 5 , borderRadius : 5}}>
                    <Ionicons name="logo-google" size={23} color={colorText}></Ionicons>
                    <Text style={[styles.soicalText , {color : colorText }]}>تسجيل في جوجل</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignItems : 'center' , justifyContent : 'center' , flexDirection: 'row' , height : 45 ,backgroundColor :colorBGAlpha,padding : 5 , borderRadius : 5}}>
                    <Ionicons name="logo-apple" size={23} color={colorText}></Ionicons>
                    <Text style={[styles.soicalText , {color : colorText }]}>تسجيل في ابل</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignItems : 'center' , justifyContent : 'center' , flexDirection: 'row' , height : 45 ,backgroundColor :colorBGAlpha,padding : 5 , borderRadius : 5}}>
                    <Ionicons name="logo-facebook" size={23} color={colorText}></Ionicons>
                    <Text style={[styles.soicalText , {color : colorText }]}>تسجيل في فيس بوك</Text>
                </TouchableOpacity>
            </View>
            <View style={{width : 350, alignItems : 'flex-end' , marginTop : 30}}>
                <TouchableOpacity onPress={()=>{
                    router.push('/(auth)')
                }}>
                <Text style={{color : minColor}}> لدية حساب , تسجيل الدخول </Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
   input : {
      height : 45 ,
      width : 350,
      padding : 8 ,
      marginVertical : 5,
      borderBottomWidth : 1,
      fontSize: 18,
      fontFamily : 'Tajawal',
      textAlign : 'right'
   },
   soicalText : {
     marginHorizontal : 5 ,
     fontSize : 17 ,
     bottom : -2 ,
     fontWeight : '500' ,
     width : 240 ,
     textAlign : 'center' 
   }
})