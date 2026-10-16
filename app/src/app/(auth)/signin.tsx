import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import { router } from 'expo-router'
import { SigninForm, signinSchema} from '@/schema/auth.schema'
import {zodResolver} from '@hookform/resolvers/zod'
import FormInput from '@/components/forms/FormInput'
import PasswordInput from '@/components/forms/PasswordInput'
import { useMutation } from '@tanstack/react-query'
import api from '../services/api'
import { useState } from 'react'
import getErrorMessage from '../utils/getErrorMessage'
import AppErrorDialog from '@/components/ErrorDialog'



const SignIn = () => {

  const {control, handleSubmit,
    formState: {errors, isSubmitting}} = useForm<SigninForm>(
      {
        resolver: zodResolver(signinSchema),
        defaultValues: {
          email:'',
          password: ''
        }
      }
    );
  const [errorDialog, setErrorDialog] = useState({
    visible:false,
    name:"Login failed",
    message:""
  })

  const mutation = useMutation({
    mutationFn: (data:SigninForm) => {
      return api.post('auth/login', data)
  }
  })

  const signIn = async (data: SigninForm) => {
    try {
      await mutation.mutateAsync(data)
    } catch (error:any) {
      const errMsg = getErrorMessage(error)
      if(error.response?.data.code === "EMAIL_NOT_VERIFIED"){
        setErrorDialog(prev => ({...prev,name:"Email Verification",message:errMsg, visible:true}))
        router.push({ pathname: '/verify-email', params: { email: error.response.data.email } });
      }else{
      setErrorDialog(prev => ({...prev, message:errMsg, visible:true}))
      }
  }
  }

  return (
    <>
    <View className='flex gap-5 p-5 mt-20'>
     <Controller
        control={control}
        name="email"
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            label='Email'
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            placeholder='Enter your email'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            />
        )}
        
      />

      <Controller
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <PasswordInput
              label="Password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
          />

          <TouchableOpacity
            onPress={ () => {}}
            className='self-end mt-3'
            >
              <Text className='font-quicksand-semibold text-base text-primary'>
                Forgot password?
              </Text>

            </TouchableOpacity>

            <TouchableOpacity  onPress={handleSubmit(signIn)} disabled={isSubmitting} 
              className='h-14 bg-primary rounded-2xl items-center justify-center mt-6'>
                {isSubmitting ? 
                  <ActivityIndicator size="small" color="#fff" />
                  :
                  <Text className='font-quicksand-semibold text-white'>
                    Sign In
                  </Text>
                }
              </TouchableOpacity>

              <View className='flex-row justify-center mt-7'>
                <Text className='font-quicksand text-base text-gray-500'>
                  Don't have an account? {" "}
                </Text>
                <TouchableOpacity onPress={() => router.replace('/signup')}>
                  <Text className='font-quicksand-bold text-base text-primary'>
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>
    </View>

    <AppErrorDialog
      visible={errorDialog.visible}
      title={errorDialog.name}
      message={errorDialog.message}
      onClose={() => setErrorDialog(prev => ({...prev, visible:false}))}
      />
    </>
  ) 
}

export default SignIn