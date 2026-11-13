import { SplashScreen, Stack } from "expo-router";
import {useFonts} from 'expo-font'
import './global.css'
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/store/auth.store";

export default function RootLayout() {
   const {isLoading, fetchAuthenticatedUser} = useAuthStore();

  const [fontsLoaded, error] = useFonts(
    {
      "Quicksand-Bold": require("@/assets/fonts/Quicksand-Bold.ttf"),
      "Quicksand-Light": require("@/assets/fonts/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("@/assets/fonts/Quicksand-Medium.ttf"),
      "Quicksand-SemiBold": require("@/assets/fonts/Quicksand-SemiBold.ttf")
    }
  )

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();

  },[fontsLoaded, error])

  if(!fontsLoaded || isLoading) return null;

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
  <Stack  screenOptions={{headerShown: false}}/>
</QueryClientProvider>
);
}
