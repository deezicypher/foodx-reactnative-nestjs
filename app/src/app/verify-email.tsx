import { router, useLocalSearchParams } from 'expo-router'
import { View, Text, Pressable, Animated, TextInput, Keyboard, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';


const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

type Status = 'idle' | 'loading' | 'error' | 'success';
type Feedback = { type: 'error' | 'info'; text: string } | null;


async function verifyEmailCode(email: string, code: string): Promise<void> {
  // await api.post('/auth/verify-email', { email, code });
  await new Promise((resolve) => setTimeout(resolve, 900));
}

async function resendEmailCode(email: string): Promise<void> {
  // await api.post('/auth/resend-verification', { email });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

const getErrorMessage = (error: unknown) => {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message ?? 'That code is incorrect or has expired.';
};

const maskEmail = (email?: string) => {
  if (!email || !email.includes('@')) return 'your email';
  const [name, domain] = email.split('@');
  const visible = name.slice(0, Math.min(2, name.length));
  const hidden = '•'.repeat(Math.max(name.length - visible.length, 3));
  return `${visible}${hidden}@${domain}`;
};

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;


type BoxState = 'idle' | 'active' | 'filled' | 'error' | 'success';

const BOX_CLASSES: Record<BoxState, { box: string; text: string }> = {
  idle: { box: 'border-gray-200 bg-gray-50', text: 'text-gray-900' },
active: { box: 'border-primary bg-white border-2', text: 'text-gray-900' },
  filled: { box: 'border-primary-border bg-primary-soft', text: 'text-gray-900' },
  error: { box: 'border-red-300 bg-red-50', text: 'text-red-500' },
  success: { box: 'border-green-300 bg-green-50', text: 'text-green-700' },
};

const Cursor = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  // Animated values can only be passed through `style`; everything else is a class.
  return <Animated.View className="h-6 w-0.5 rounded-full bg-primary" style={{ opacity }} />;
};
const OtpBox = ({ digit, state }: { digit: string; state: BoxState }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const classes = BOX_CLASSES[state];

  useEffect(() => {
    if (!digit) return;
    scale.setValue(0.86);
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [digit, scale]);

  return (
    <Animated.View
      className={`h-16 flex-1 items-center justify-center rounded-2xl border-[1.5px] ${classes.box}`}
      style={{ transform: [{ scale }] }}
    >
      {digit ? (
        <Text className={`text-2xl font-quicksand-bold ${classes.text}`}>{digit}</Text>
      ) : state === 'active' ? (
        <Cursor />
      ) : null}
    </Animated.View>
  );
};

const VerifyEmail = () => {
  const {email} = useLocalSearchParams<{email?:string}>();
  const inputRef = useRef<TextInput>(null);
  const shakeX = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState<Status>('idle');
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const [feedback, setFeedback] = useState<Feedback>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);




  const isComplete = code.length === CODE_LENGTH;
  const isBusy = status === 'loading' || status === 'success';
  const canSubmit = isComplete && status === 'idle';

  const getBoxState = (index: number): BoxState => {
    if (status === 'error') return 'error';
    if (status === 'success') return 'success';
    if (code[index]) return 'filled';
    if (isFocused && index === code.length) return 'active';
    return 'idle';
  };


  const handleVerify = useCallback(
      async (value: string) => {
        if (value.length !== CODE_LENGTH || status !== 'idle') return;
  
        Keyboard.dismiss();
        setStatus('loading');
        setFeedback(null);
  
        try {
          await verifyEmailCode(email ?? '', value);
          setStatus('success');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => router.replace('/(tabs)'), 800);
        } catch (error) {
          setStatus('error');
          setFeedback({ type: 'error', text: getErrorMessage(error) });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setTimeout(() => {
            setCode('');
            setStatus('idle');
            inputRef.current?.focus();
          }, 900);
        }
      },
      [email, status]
    );

    const handleChange = (text: string) => {
      if (status === 'loading' || status === 'success') return;
  
      const cleaned = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
      if (cleaned.length > code.length) Haptics.selectionAsync();
  
      setCode(cleaned);
      if (feedback) setFeedback(null);
      if (cleaned.length === CODE_LENGTH) handleVerify(cleaned);
    };


    const handleResend = async () => {
        if (secondsLeft > 0 || isResending || status === 'loading') return;
    
        setIsResending(true);
        try {
          await resendEmailCode(email ?? '');
          setCode('');
          setStatus('idle');
          setSecondsLeft(RESEND_SECONDS);
          setFeedback({ type: 'info', text: 'A new code is on its way to your inbox.' });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          inputRef.current?.focus();
        } catch {
          setFeedback({ type: 'error', text: "Couldn't resend the code. Please try again." });
        } finally {
          setIsResending(false);
        }
      };


    const buttonClasses = [
      'mt-2 h-14 flex-row items-center justify-center gap-2 rounded-[18px] active:opacity-90',
      status === 'success' ? 'bg-green-500' : 'bg-primary',
      canSubmit || isBusy ? 'opacity-100' : 'opacity-50',
    ].join(' ');

  return (
    <SafeAreaView className='p-5' >
    <ScrollView  keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole='button'
            accessibilityLabel='Go back'
            hitSlop={8}
            className='size-11 items-center justify-center rounded-full border border-gray-200 bg-white active:bg-gray-200'>
              <Ionicons name="arrow-back" size={20} color="#111827" />
            </Pressable>
        

        <View className='mt-4 items-center'>
          <View className='size-28 items-center rounded-full bg-orange-50'>
            <View className='size-20 items-center justify-center rounded-[28px] bg-soft'>
                <Ionicons
                  name={status === "success" ? "checkmark-circle" : "mail-open-outline"}
                  size={40}
                  color={status=== "success" ? "#22C55E" :"#FE8C00" }
                  />
            </View>
          </View>
        </View>

        <View className='mt-7 items-center'>
          <Text className='text-center text-3xl font-quicksand-bold text-gray-500'>
            Verify your email
          </Text>
          <Text className='mt-2.5 text-center text-base leading-6 text-gray-500'>
            We sent a {CODE_LENGTH}-digit code to{'\n'}
            <Text className='font-quicksand-semibold text-gray-900'>{maskEmail(email)}</Text>
          </Text>
        </View>

        <Animated.View className="mt-9 " style={{transform: [{translateX: shakeX}]}}>
          <View className='relative'>
          <View className="flex-row gap-2.5" >
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <OtpBox key={index} digit={code[index] ?? ''} state={getBoxState(index)} />
                ))}
              </View>
            <TextInput 
              ref={inputRef}
              value={code}
              onChangeText={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={CODE_LENGTH}
              keyboardType='number-pad'
              inputMode='numeric'
              textContentType='oneTimeCode'
              autoComplete='sms-otp'
              importantForAutofill='yes'
              editable={!isBusy}
              caretHidden
              autoCorrect={false}
              selectionColor="transparent"
              accessibilityLabel={`Enter the ${CODE_LENGTH}-digit verification code`}
              className="-mt-16 h-16 bg-transparent text-2xl text-transparent"
              />
          </View>
        </Animated.View>

        <View className='mt-3.5 min-h-[44px] justify-center'>
          {feedback? 
          <View className='flex-row items-center justify-center gap-1.5'>
            <Ionicons
              name={feedback.type === "error" ? 'alert-circle' : 'checkmark-circle' } 
              size={16}
              color={feedback.type === 'error' ? "#EF4444" : "#22C55E"}
              />
              <Text 
                className={`text-center text-sm font-quicksand-medium ${feedback.type === 'error' ? 'text-red-500': 'text-green-700'}`}
                >
                    {feedback.text}
              </Text>

          </View>
          : null
        }
        </View>

        <Pressable
          onPress={() => handleVerify(code)}
          disabled={!canSubmit}
          accessibilityRole='button'
          accessibilityState={{disabled: !canSubmit, busy: status === 'loading'}}
          className={buttonClasses}
          >
            {status === 'loading' ? 
          <ActivityIndicator color="#ffffff" />
          : status === 'success' ?
          <>
          <Ionicons name="checkmark" size={20} color="#ffffff" />
          <Text className='text-base font-quicksand-bold text-white'>
            Verified
          </Text>
          </>  
          :
          <Text className='text-base font-quicksand-bold text-white'>Verify Email</Text>
          }
          </Pressable>


          <View className='mt-7 items-center'>
            <View className='flex-row items-center gap-1.5'>
              <Text className='text-sm text-gray-500'>Didn't get the code?</Text>
              {secondsLeft > 0 ? 
                <Text className='text-sm font-quicksand-semibold text-gray-400'>
                  Resend in {formatTime(secondsLeft)}
                </Text>  
                :
                <Pressable 
                  onPress={handleResend}
                  disabled={isResending}
                  hitSlop={10}
                  accessibilityRole='button'
                  accessibilityLabel='Resend verification code'
                  >
                    {isResending ? 
                    <ActivityIndicator size="small" color="#FE8C00" />
                    :
                    <Text className="text-sm font-quicksand-bold text-primary">Resend Code</Text>
                      
                    }
                  </Pressable>
            }
            </View>

             <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className='mt-4'
            accessibilityRole='button'
            >
              <Text className='text-sm text-gray-500'>
                Wrong email? <Text className='font-quicksand-semibold text-gray-900'>
                  Change it
                </Text>
              </Text>
            </Pressable>
          </View>

         
        </ScrollView>
    </SafeAreaView>
  )
}

export default VerifyEmail