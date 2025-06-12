import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import useAuthStore from "@/store/authStore";

const AuthLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
