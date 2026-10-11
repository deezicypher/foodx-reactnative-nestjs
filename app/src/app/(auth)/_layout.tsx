import { Slot } from 'expo-router'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../../constants'
import '../global.css'

const AuthLayout = () => {
  return (
   <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className='bg-white h-full' keyboardShouldPersistTaps="handled">
        <View className='w-full relative' style={{height: Dimensions.get('screen').height/2.25}}>
          <ImageBackground source={images.loginGraphic} className='size-full rounded-b-lg' resizeMode='cover' />
          <View style={{
            position:"absolute",
            alignSelf:"center",
            bottom: -50,
            zIndex:10,
            elevation:10
          }}>
            <Image source={images.logo} 
            style={{
              width:130,
              height:130,
              borderRadius:30
            }}
            />  
            </View>
            </View>
                 <Slot/>
      </ScrollView>
 
      </KeyboardAvoidingView>


  )
}

export default AuthLayout