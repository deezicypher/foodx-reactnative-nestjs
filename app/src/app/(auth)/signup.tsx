import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { SignupForm, signupSchema } from '@/schema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '@/components/forms/FormInput'
import PasswordInput from '@/components/forms/PasswordInput'

const SignUp = () => {

  const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email:"",
      password: "",
      confirmPassword: ""
    },

  })

  const signUp = async (data:SignupForm) => {
    console.log(data)
  }

  return (
    <View className='p-5 mt-20 flex gap-5'>
        <Controller
          control={control}
          name="name"
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
                value={value}
                label="Name"
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                placeholder='Enter your name'
                autoCapitalize='words'
            />
          )}
          />

          <Controller
              control={control}
              name="email"
              render={({field: {onChange,onBlur,value}}) => (
                <FormInput
                  label='Email'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder='Enter your email'
                  autoCapitalize='none'
                  keyboardType='email-address'
                  autoCorrect={false}
                  error={errors.email?.message}
                  />
              )}
              />

          
          <Controller
              control={control}
              name="password"
              render={({field: {onChange,  value}}) => (
                <PasswordInput
                  label='Password'
                  placeholder='Create a password'
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

          
          <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, value}}) => (
                <PasswordInput
                  label='Comfirm Password'
                  value={value}
                  placeholder='Confirm your password'
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  />
              )}
              />

              <TouchableOpacity onPress={handleSubmit(signUp)} disabled={isSubmitting}
              className='items-center justify-center h-14 mt-6 bg-primary rounded-2xl'>
                {isSubmitting ?
                <ActivityIndicator size="small" color="#fff" />
                :
              <Text className='font-quicksand-semibold text-white'>Sign Up</Text>
              }
                
              </TouchableOpacity>

              <View className='flex flex-row  justify-center mt-7'>
                <Text className='font-quicksand text-base text-gray-500'>
                  Already have an account? {" "}
                </Text>

                <TouchableOpacity onPress={() => router.replace('/signin')}>
                <Text className='font-quicksand-bold text-base text-primary'>
                  Sign in
                  </Text>
                </TouchableOpacity>
              </View>
    </View>
  )
}

export default SignUp