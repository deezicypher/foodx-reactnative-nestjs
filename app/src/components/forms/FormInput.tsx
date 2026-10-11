import { View, Text, TextInputProps, TextInput } from 'react-native'

type FormInputProps = TextInputProps & {
    label: string;
    error?: string;
}

const FormInput = ({
    label,
    error,
    placeholder,
    ...props
}: FormInputProps) => {
  return (
    <View className='mt-5'>
      <Text className='font-quicksand-bold text-base text-gray-500'>{label}</Text>
      <TextInput {...props}
        placeholder={placeholder}
        className={`rounded-lg px-4 h-14 mt-5 tet-gray-300 bg-gray-50 border-b font-quicksand-semibold ${error ? 'border-b-red-400':'border-b-gray-200'}`}
        placeholderTextColor="#9CA3AF"
        />
        {
            error && (
                <Text className='font-quicksand-medium text-xs text-red-500 mt-2 ml-1'>
                    {error}
                </Text>
            )
        }
    </View>
  )
}

export default FormInput