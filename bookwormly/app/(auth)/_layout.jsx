import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import useAuthStore from "@/store/authStore";

const AuthLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, signin, checkAuth, refreshToken, user } = useAuthStore();

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await checkAuth(); // checks and sets `user` and `refreshToken`
      setInitialCheckDone(true); // now we can safely navigate
    };
    verify();
  }, [checkAuth]);

  console.log(segments);
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && refreshToken;

    console.log("SEGMENTS", segments[0]);
    const timeout = setTimeout(() => {
      if (!isSignedIn && !inAuthScreen) {
        router.replace("/(auth)");
      } else if (isSignedIn && inAuthScreen) {
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [initialCheckDone, segments, refreshToken, user, router]);
  return <Stack screenOptions={{ headerShown: false }}></Stack>;
};

export default AuthLayout;
