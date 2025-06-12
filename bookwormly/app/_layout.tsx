import COLORS from "@/constants/Colors";
import useAuthStore from "@/store/authStore";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, refreshToken, user } = useAuthStore();

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await checkAuth(); // checks and sets `user` and `refreshToken`
      setInitialCheckDone(true); // now we can safely navigate
    };
    verify();
  }, [checkAuth]);

  console.log("SEGMENTS", segments);

  useEffect(() => {
    if (!initialCheckDone) return;

    const isSignedIn = !!user && !!refreshToken;
    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [initialCheckDone, segments, user, refreshToken, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        </SafeAreaView>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
