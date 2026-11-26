import CartButton from '@/components/CartButton'
import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { FlatList, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import cn from "clsx"
import MenuCard from '@/components/MenuCard'
import { MenuItem } from '../../../type'
import SearchBar from '@/components/SearchBar'
import Filter from '@/components/Filter'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const {category, query} = useLocalSearchParams<{query?:string; category?:string}>();

  const getMenu = async () => {
    const res = await api.get('menu/search', {
      params: { category, query },
    })
    return res.data
  }

  const getCategories = async () => {
    const res = await api.get('categories')
    return res.data
  }

  const {data, isPending} = useQuery({
    queryKey: ['menus', category, query],
    queryFn: getMenu,
  })
  const {data:categories,isPending:isPendingCat} = useQuery({queryKey:['categories'], queryFn:getCategories})

  return (
    <SafeAreaView className='bg-white h-full'>
      <FlatList
        data={data}
        renderItem={({item,index}) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10': 'mt-0')}>
              <MenuCard item={item as MenuItem} />
            </View>
          )
        }}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperClassName='gap-7'
        contentContainerClassName='gap-7 px-5 pb-32'
        ListHeaderComponent={() => (
          <View className='my-5 gap-5'>
            <View className='flex items-center justify-between flex-row w-full'>
              <View className='flex items-start justify-center'>
                <Text className="text-xs font-quicksand-bold uppercase text-primary">Search</Text>
                <View className='flex items-start justify-center flex-row gap-x-1 mt-0.5'>
                  <Text className='text-base font-quicksand-semibold text-dark-100'>
                      Find your favorite food
                  </Text>
                </View>
              </View>
              <CartButton/>
            </View>
            <SearchBar />
            <Filter categories={categories}/>

          </View>
        )}
        ListEmptyComponent={() => !isPending && <Text>No result</Text>}
      />
    </SafeAreaView>
  )
}

export default Search