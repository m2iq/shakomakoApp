import { StyleSheet , FlatList , Image , Button , TouchableOpacity } from 'react-native';
import React from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import useAuthGuard from "@/hooks/useAuthGuard";



export default function TabTwoScreen() {
   const {user , loading} = useAuthGuard();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        الاشعارات
        
      </Text>
      {loading ? <Text>loading</Text> : <Text>{user?.id}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    backgroundColor: '#7c7c7c38',
    padding: 10,
    justifyContent: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    width: 300,
    textAlign: 'right',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
  buttonFollow: {
    backgroundColor: '#00d4f0ff',
    padding: 0,
    height: 35,
    width: 60,
    borderRadius: 5,
    marginRight: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },  
  
});
