import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "expo-router";

export default function useAuthGuard(userId = null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/(auth)");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", userId || user.id)
        .single();

      if (!error) setUser(data);
      else console.error(error);
    } catch (e) {
      console.error("Auth check error:", e);
      router.replace("/(auth)");
    } finally {
      setLoading(false);
    }
  };

  // استمع لتغير الجلسة
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (!session) router.replace("/(auth)");
    else getUser();
  });

  getUser();

  return () => subscription.unsubscribe();
}, []);


  return { user, loading };
}
