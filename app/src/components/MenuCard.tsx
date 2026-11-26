import React from 'react'
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import { MenuItem } from '../../type'

const MenuCard = ({item:{image_url, name, price}}:{item: MenuItem}) => {
  return (
    <TouchableOpacity 
    className='relative  flex items-center justify-end bg-white shadow-md shadow-black/10 rounded-3xl'
    style={Platform.OS === 'android' ? {elevation:10, shadowColor: "#878787"}:{}}
    >
        <Image source={{uri: image_url}} className='size-32 w-full rounded-t-3xl'
        resizeMode='cover'
        />
        <View className='py-9 px-3.5'>
        <Text className="text-center text-lg font-quicksand-bold text-dark-100 mb-2" numberOfLines={1}>
            {name}
        </Text>
        <Text className='text-sm font-quicksand text-gray-200 mb-4'>
            From ${price}
        </Text>
        <TouchableOpacity>
            <Text className='text-base font-quicksand-bold text-primary'>Add to Cart +</Text>
        </TouchableOpacity>
        </View>
    </TouchableOpacity>
  )
}

export default MenuCard