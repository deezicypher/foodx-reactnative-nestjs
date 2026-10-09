import { Text, View, StyleSheet, FlatList, Pressable, Image, TouchableOpacity } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context'
import { images, offers } from "../../constants";
import {Fragment} from 'react'
import cn from 'clsx'

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">

      <FlatList 
        data={offers}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
                <View className="flex items-center justify-between flex-row w-full my-5">
        <View className="flex items-start justify-center">
        <Text className="text-xs font-quicksand-bold text-primary">DELIVER TO</Text>
        <TouchableOpacity className="flex items-center justify-center flex-row gap-x-1 mt-0.5">
          <Text className="text-base font-quicksand-bold text-dark-100">Nigeria</Text>
          <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <Text>Cart</Text>
      </View>
        )}
        renderItem={({item, index}) => {
          const isEven:boolean = index%2 === 0;

          return (
            <View> 
              <Pressable 
              className={cn(`w-full h-48 my-3 rounded-xl p-4 overflow-hidden shadow-lg flex items-center gap-5`, isEven? "flex-row-reverse": 'flex-row')}
              style={{backgroundColor:item.color}}
              android_ripple={{color:"#fffff22"}}
              >
                {({pressed}) => (
                    <>
                    <View className="h-full w-1/2 "> 
                    <Image source={item.image} className="size-full" resizeMode="contain" />
                    </View>
                    <View className="flex-1 flex-col h-full justify-center items-start gap-4">
                      <Text className="text-3xl font-quicksand-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image source={images.arrowRight} className="size-10"
                        tintColor="#fff"
                        resizeMode="contain"
                        />
                    </View>
                  </>
                )}
               
              </Pressable>
            </View>
          )
        }}
        contentContainerClassName="pb-32 px-5"
/>
    </SafeAreaView>
  );
}


