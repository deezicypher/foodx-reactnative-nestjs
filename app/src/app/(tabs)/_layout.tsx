import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, Slot } from 'expo-router'
import useAuthStore from '@/store/auth.store';

const _Layout = () => {
    const {isAuthenticated, fetchAuthenticatedUser} = useAuthStore();
  
    useEffect(() => {
      fetchAuthenticatedUser();
    }, [])

    if(!isAuthenticated) return <Redirect href="/signin" />
  return <Slot/>
}

export default _Layout