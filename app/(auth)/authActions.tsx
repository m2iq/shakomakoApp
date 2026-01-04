import { useEffect } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

WebBrowser.maybeCompleteAuthSession();
 export async function checkAuth(router : any){
    const savedSession = await AsyncStorage.getItem("session");
    if(savedSession){
      router.back() || router.replace("../(tabs)");
    }
  }

export function listenToAuthChanges(router : any) {

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
       // Alert.alert("✅ تم تسجيل الدخول", session.user.email || "");
         router.replace("../(tabs)");
      }
    }
  );

  return () => listener.subscription.unsubscribe();
}

export async function SignInWithGoogle(router : any) {
  try {
    // استخدام expo-linking للحصول على الـ redirect URL الصحيح
    const redirectTo = Linking.createURL("/");
    

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      Alert.alert("❌ خطأ في OAuth", error.message);
      return;
    }

    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );


      if (res.type === "success" && res.url) {

        
        // استخراج الـ fragment من الـ URL
        const url = new URL(res.url);
        
        // Supabase يُرجع التوكن في الـ hash (#) وليس في query params
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

       
        if (access_token && refresh_token) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          await AsyncStorage.setItem('session', JSON.stringify(sessionData));
          if (sessionError) {
           // Alert.alert("❌ خطأ في الجلسة", sessionError.message);
          } else if (sessionData?.user) {
            //Alert.alert("✅ تم تسجيل الدخول", sessionData.user.email || "");
            const user  = sessionData.user;
              const { data: existingUser, error: fetchError } = await supabase
              .from("users")
              .select("uid")
              .eq("uid", sessionData?.user?.id)
              .single();
              if(!existingUser){
              

     

                const { error: insertError } = await supabase.from("users").insert({
              username :'user-'+ new Date().getTime(),
              name : user.user_metadata.full_name ,
              uid : sessionData?.user?.id,
              createAt : new Date(),
              login_data : {
                deviceType : Device.deviceName ,
                osName : Device.osName ,
                browserName : Device.brand ,
                loginedAt : new Date(),
              
              }
            })
              }else{
                Alert.alert('user not  exist');
              }
             if(error){
              Alert.alert(error);
             }
             router.replace("/(tabs)");
          }
        } else {
          Alert.alert("❌ لم يتم العثور على التوكن", `URL: ${res.url}`);
        }
      } else if (res.type === "cancel") {
        Alert.alert("⚠️ تم إلغاء تسجيل الدخول");
      } else if (res.type === "dismiss") {
        //Alert.alert("⚠️ تم إغلاق نافذة المتصفح");
      }
    }
  } catch (err) {
    Alert.alert( "حدث خطأ غير متوقع");
  }
}