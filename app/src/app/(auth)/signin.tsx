import { View, Text, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import { router } from 'expo-router'
import { SigninForm, signinSchema} from '@/schema/auth.schema'
import {zodResolver} from '@hookform/resolvers/zod'
import FormInput from '@/components/forms/FormInput'
import PasswordInput from '@/components/forms/PasswordInput'



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
    )

  const signIn = async (data: SigninForm) => {
    //router.push({ pathname: '/verify-email', params: { email:data.email } });
    // if(error.response?.data.code === "EMAIL_NOT_VERIFIED"){
    //   router.push({ pathname: '/verify-email', params: { email: error.response.data.email } });
    // }
  }

  return (
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
  ) 
}

export default SignIn