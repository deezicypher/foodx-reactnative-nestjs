import { Slot } from 'expo-router'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Image } from 'react-native'
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
          <Image
            source={images.loginGraphic}
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-b-[32px]"
            resizeMode="cover"
          />
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