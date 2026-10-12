import { useState } from 'react';
import { View, Text, TextInputProps, TextInput, TouchableOpacity } from 'react-native'

type PasswordInputProps = TextInputProps & {
    label:string;
    onChangeText: (value:string) => void;
    error?: string;
    placeholder?: string;
}

const PasswordInput = ({
    label,
    onChangeText,
    error,
    placeholder="Enter your password",
    ...props
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <View className='mt-5'>
      <Text className='font-quicksand-bold text-base text-gray-500 mb-2'>
        {label}
      </Text>
      <View className='relative'>
      <TextInput
        {...props}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={!showPassword}
        autoCapitalize='none'
        className={`h-14 rounded-lg px-4 pr-16 mt-5 font-quicksand-semibold text-base text-gray-500 bg-gray-50 border-b
            ${error? 'border-red-400' : 'border-gray-200'}
            `}
        />
        <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            className='absolute right-4 top-5 h-14 justify-center'
            >
                <Text className='font-quicksand-medium text-sm text-primary'>
                    {showPassword? 'Hide':'Show'}
                </Text>

        </TouchableOpacity>
        </View>
        {
            error && (
                <Text className='font-quicksand-medium text-base text-red-500 mt-2 ml-1'>
                    {error}
                </Text>
            )
        }
    </View>
  )
}

export default PasswordInput