import { useLocalSearchParams } from "expo-router";
import ProfileScreen from "../(tabs)/profile";

export default function UserProfileWrapper() {
  // ✅ هذه الدالة تجيب كل البراميترز من الرابط
  const { userid } = useLocalSearchParams();

  // مرّره إلى ProfileScreen
  return <ProfileScreen userId={userid} />;
}