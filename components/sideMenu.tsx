// 📄 components/SideMenu.tsx

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  menuItems?: { label: string; onPress?: () => void }[];
}

export default function SideMenu({ visible, onClose, menuItems }: SideMenuProps) {
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* الخلفية الداكنة */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      />
      
      {/* القائمة الجانبية */}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>القائمة</Text>
        {(menuItems || defaultMenuItems(onClose)).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              onClose();
              item.onPress && item.onPress();
            }}
          >
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
}

function defaultMenuItems(onClose: () => void) {
  return [
    { label: 'الإعدادات والخصوصية', onPress: onClose },
    { label: 'الابداع', onPress: onClose },
    { label: 'المساعدة', onPress: onClose },
    { label: 'تسجيل الخروج', onPress: onClose },
  ];
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00000080',
    zIndex:5
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: width * 0.75,
    backgroundColor: '#111',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex:14
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
});
