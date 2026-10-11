import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'

const _Layout = () => {
    const isAuthenticated = false
    if(!isAuthenticated) return <Redirect href="/signin" />
  return <Slot/>
}

export default _Layout