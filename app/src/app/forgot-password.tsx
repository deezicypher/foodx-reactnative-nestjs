import { View, Text, ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FormInput from '@/components/forms/FormInput'
import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import getErrorMessage from '../utils/getErrorMessage'
import AppErrorDialog from '@/components/ErrorDialog'

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>();
    const [error, setError] = useState<string>();
    const [errorDialog, setErrorDialog] = useState({
        title:"Forgot Password Error",
        visible:false,
        message:""
    })
    
    const mutation = useMutation({
        mutationFn: () => {
         return api.post('auth/forgot-password',{email})
        }
    })

    const handleChange = (v:string) => {
       
        setError('')
         setEmail(v)
    }
    const sendEmail = async () => {
        if(!email) return setError('Please input your email')
        try {
            const res = await mutation.mutateAsync()
            router.push({pathname:'/verify-email', params:{email:res.data.email}})
        } catch (error:any) {
            console.log(error)
            const errorMsg = getErrorMessage(error)
            setErrorDialog(prev => ({...prev,message:errorMsg,visible:true}))
        }
    }

    
  return (
    <>
    <SafeAreaView className="p-5">
        <ScrollView keyboardShouldPersistTaps="handled">
            <Pressable
                onPress={() => router.back()}
                accessibilityRole='button'
                accessibilityLabel='Go back'
                hitSlop={8}
                className='size-11 items-center justify-center rounded-full border border-gray-200 bg-white active:bg-gray-200'>
                <Ionicons name="arrow-back" size={20} color="#111827" />
            </Pressable>
            <View className='mt-7 items-center'>
                <Text className='text-center text-3xl font-quicksand-bold text-gray-500'>
                Forgot Password
                </Text>
                <Text className='mt-2.5 text-center text-base leading-6 text-gray-500 mb-10'>
                    Input your email
                </Text>
            </View>

            <FormInput
                label='Email'
                onChangeText={v => handleChange(v)}
                error={error}
                placeholder='Enter your email address'
                autoCapitalize='none'
                keyboardType='email-address'
                autoCorrect={false}
            />

            <TouchableOpacity  onPress={sendEmail} disabled={mutation.isPending} 
                className='h-14 bg-primary rounded-2xl items-center justify-center mt-6'>
                {mutation.isPending ? 
                    <ActivityIndicator size="small" color="#fff" />
                    :
                    <Text className='font-quicksand-semibold text-white'>
                    Forgot Password
                    </Text>
                }
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
    <AppErrorDialog
        visible={errorDialog.visible}
        title={errorDialog.title}
        message={errorDialog.message}
        onClose={() => setErrorDialog(prev => ({...prev,visible:false}))}
    />
    </>
  )
}

export default ForgotPassword