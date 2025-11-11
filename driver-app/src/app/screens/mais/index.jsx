import { useAuth } from "@/src/hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";

export default function Mais() {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  return (
    <View className="items-center justify-center w-full h-full">
      <Button title="Sair" onPress={handleLogout} color="black" />
    </View>
  );
}
