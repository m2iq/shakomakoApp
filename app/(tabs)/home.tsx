import { StyleSheet , FlatList , Image , Button , TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import PostView from '@/components/postView';
import { supabase } from '../../utils/supabase';
import { getPosts } from "@/utils/getPosts"; // المسار حسب مشروعك




export default function TabTwoScreen() {
 
   const [users, setUsers] = React.useState<any[]>([]);
    const [posts, setPosts] = useState<any>([]);
   const [loading, setLoading] = useState<boolean>(true);
 

   useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const result = await getPosts(50); // الحد الأقصى للمنشورات
        setPosts(result.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

    async function fetchUsers() {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }

      setUsers(data);
    }

   

    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>لا توجد منشورات حالياً</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
     

        <FlatList
      data={posts}
      keyExtractor={(item) => item.post_id.toString()}
       showsVerticalScrollIndicator={false}
      renderItem={({ item }) =>  <PostView post={item} />}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 30,
  },
  

 
  
});
