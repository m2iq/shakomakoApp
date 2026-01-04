import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import useAuthGuard from "@/hooks/useAuthGuard";
export default function ChatApp() {
  const router = useRouter();
  const { user, loading } = useAuthGuard();

  
  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("session");
    router.replace("/(auth)");
  };
  console.log(user)
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "white", marginTop: 10 }}>جارٍ التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "black" }}>
      <Text style={{ color: "white", fontSize: 20, marginBottom: 40 }}>
        Name: {user.username}
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(auth)")}
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          تسجيل الدخول
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: "#E53935",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          تسجيل الخروج
        </Text>
      </TouchableOpacity>
    </View>
  );
}
