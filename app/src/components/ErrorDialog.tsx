import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppErrorDialogProps = {
  visible: boolean;
  title?: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
  onAction?: () => void;
};

export default function AppErrorDialog({
  visible,
  title = 'Something went wrong',
  message,
  buttonLabel = 'Got it',
  onClose,
  onAction,
}: AppErrorDialogProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      scale.setValue(0.94);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  const handleAction = () => {
    onClose();
    onAction?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center bg-black/50 px-6"
        style={{
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityLabel="Dismiss error dialog"
        />

        <Animated.View
          accessibilityViewIsModal
          className="w-full max-w-[380px] items-center rounded-[28px] bg-white px-6 pb-6 pt-8 shadow-2xl"
          style={{
            opacity,
            transform: [{ scale }],
          }}
        >
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
            className="absolute right-4 top-4 h-9 w-9 items-center justify-center rounded-full bg-[#F5F7F5]"
          >
            <Feather name="x" size={24} color="black"  />
          </Pressable>

          <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0]">
              <Feather name="alert-circle" size={24} color="black" />
          </View>

          <Text className="mb-2 text-center font-rubik-semibold text-[21px] leading-[29px] text-[#17231D]">
            {title}
          </Text>

          <Text className="mb-7 text-center font-rubik-regular text-sm leading-[22px] text-[#68736D]">
            {message}
          </Text>

          <Pressable
            onPress={handleAction}
            accessibilityRole="button"
            className="min-h-[54px] w-full items-center justify-center rounded-2xl bg-primary px-4 active:bg-primary"
          >
            <Text className="font-rubik-medium text-[15px] text-white">
              {buttonLabel}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}