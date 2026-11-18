import { View, Text, Image } from 'react-native'
import { Redirect, Tabs } from 'expo-router'
import useAuthStore from '@/store/auth.store';
import { TabBarIconProps } from '../../../type';
import { images } from '../../../constants';
import authStore from '@/store/auth.store';


const TabBarIcon = ({focused, icon, title}: TabBarIconProps) => {
  return (
    <View className="flex min-w-20 h-full items-center justify-center gap-1 mt-12">
      <Image source={icon} className="size-7" resizeMode="contain"  tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
      <Text>{title}</Text>
    </View>
  )
}

const _Layout = () => {
    const {isAuthenticated, isLoading} = useAuthStore();

    if(isLoading) return null
    if(!isAuthenticated) return <Redirect href="/signin" />


  return (
    <Tabs 
      screenOptions={{
        headerShown: false, 
        tabBarShowLabel:false, 
        tabBarStyle:{
          borderRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: 'absolute',
          bottom: 40,
          backgroundColor: '#fff',
          shadowColor: '#1a1a1a',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5

      }}
    }
    >
    <Tabs.Screen 
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({focused}) => <TabBarIcon title='Home' icon={images.home} focused={focused}  />
      }}
    />
        <Tabs.Screen 
      name="search"
      options={{
        title: 'Search',
        tabBarIcon: ({focused}) => <TabBarIcon title='Search' icon={images.search} focused={focused}  />
      }}
    />

        <Tabs.Screen 
      name="cart"
      options={{
        title: 'Cart',
        tabBarIcon: ({focused}) => <TabBarIcon title='Cart' icon={images.bag} focused={focused}  />
      }}
    />

        <Tabs.Screen 
      name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({focused}) => <TabBarIcon title='Profile' icon={images.person} focused={focused}  />
      }}
    />



    </Tabs>
    
  )
}
export default _Layout