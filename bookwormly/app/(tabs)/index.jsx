import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import useAuthStore from "@/store/authStore";

const Home = () => {
  const { logout } = useAuthStore();
  return (
    <View>
      <Text>index</Text>
      <TouchableOpacity onPress={logout}></TouchableOpacity>
    </View>
  );
};

export default Home;
