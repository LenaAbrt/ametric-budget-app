import React, { useState } from 'react'
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    ScrollView, 
    Alert 
} from 'react-native'
import { styled } from 'nativewind'
import { useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { Linking } from 'react-native'

const SafeAreaView = styled(RNSafeAreaView)
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledPressable = styled(Pressable)

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [showMFA, setShowMFA] = useState(false)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async () => {
        if (!emailAddress || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        if (!validateEmail(emailAddress)) {
            Alert.alert('Error', 'Please enter a valid email address')
            return
        }

        try {
            const { error } = await signIn.password({
                emailAddress,
                password,
            })
            
            if (error) {
                Alert.alert('Error', error.message)
                return
            }

            console.log('Sign-in status:', signIn.status)
            if (signIn.status === 'complete') {
                console.log('Sign-in is complete, finalizing...')
                await signIn.finalize({
                    navigate: ({ session }) => {
                        console.log('Navigate callback called, session:', session?.status)
                        if (session?.currentTask) {
                            console.log('Session has current task:', session?.currentTask)
                            return
                        }
                    },
                })
                
                // Navigate outside of Clerk callback
                console.log('Navigating outside of callback to: /')
                router.replace('/')
            } else if (signIn.status === 'needs_second_factor') {
                // Handle MFA
                const emailCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === 'email_code',
                )

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode()
                    setShowMFA(true)
                } else {
                    Alert.alert('Error', 'No supported second factor available')
                }
            } else if (signIn.status === 'needs_client_trust') {
                // Handle client trust
                const emailCodeFactor = signIn.supportedSecondFactors.find(
                    (factor) => factor.strategy === 'email_code',
                )

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode()
                    setShowMFA(true)
                }
            } else {
                Alert.alert('Error', 'Sign-in attempt not complete')
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Something went wrong')
        }
    }

    const handleVerifyMFA = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter the verification code')
            return
        }

        try {
            await signIn.mfa.verifyEmailCode({ code })

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask)
                            return
                        }

                        router.replace('/(tabs)/index')
                    },
                })
            } else {
                Alert.alert('Error', 'Sign-in attempt not complete')
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid verification code')
        }
    }

    const handleResendCode = async () => {
        try {
            await signIn.mfa.sendEmailCode()
            Alert.alert('Success', 'A new verification code has been sent to your email')
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to resend code')
        }
    }

    const handleStartOver = () => {
        signIn.reset()
        setShowMFA(false)
        setCode('')
    }

    if (showMFA || signIn.status === 'needs_client_trust') {
        return (
            <SafeAreaView className="auth-safe-area">
                <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
                    <StyledView className="auth-content">
                        <StyledView className="auth-brand-block">
                            <StyledView className="auth-logo-wrap">
                                <StyledView className="auth-logo-mark">
                                    <StyledText className="auth-logo-mark-text">B</StyledText>
                                </StyledView>
                                <StyledView>
                                    <StyledText className="auth-wordmark">Budget</StyledText>
                                    <StyledText className="auth-wordmark-sub">Track expenses</StyledText>
                                </StyledView>
                            </StyledView>
                        </StyledView>

                        <StyledView className="auth-card">
                            <StyledText className="auth-title">Verify your identity</StyledText>
                            <StyledText className="auth-subtitle">
                                We've sent a verification code to your email for extra security
                            </StyledText>

                            <StyledView className="auth-form mt-6">
                                <StyledView className="auth-field">
                                    <StyledText className="auth-label">Verification Code</StyledText>
                                    <StyledTextInput
                                        className={`auth-input ${errors.fields.code ? 'auth-input-error' : ''}`}
                                        value={code}
                                        placeholder="Enter 6-digit code"
                                        placeholderTextColor="#666666"
                                        onChangeText={setCode}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        autoCapitalize="none"
                                    />
                                    {errors.fields.code && (
                                        <StyledText className="auth-error mt-1">
                                            {errors.fields.code.message}
                                        </StyledText>
                                    )}
                                </StyledView>

                                <StyledPressable
                                    className={`auth-button ${!code || fetchStatus === 'fetching' ? 'auth-button-disabled' : ''}`}
                                    onPress={handleVerifyMFA}
                                    disabled={!code || fetchStatus === 'fetching'}
                                >
                                    <StyledText className="auth-button-text">
                                        {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify Code'}
                                    </StyledText>
                                </StyledPressable>

                                <StyledPressable
                                    className="auth-secondary-button mt-3"
                                    onPress={handleResendCode}
                                    disabled={fetchStatus === 'fetching'}
                                >
                                    <StyledText className="auth-secondary-button-text">
                                        Resend Code
                                    </StyledText>
                                </StyledPressable>

                                <StyledPressable
                                    className="auth-secondary-button mt-2"
                                    onPress={handleStartOver}
                                    disabled={fetchStatus === 'fetching'}
                                >
                                    <StyledText className="auth-secondary-button-text">
                                        Start Over
                                    </StyledText>
                                </StyledPressable>
                            </StyledView>
                        </StyledView>
                    </StyledView>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="auth-safe-area">
            <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
                <StyledView className="auth-content">
                    <StyledView className="auth-brand-block">
                        <StyledView className="auth-logo-wrap">
                            <StyledView className="auth-logo-mark">
                                <StyledText className="auth-logo-mark-text">B</StyledText>
                            </StyledView>
                            <StyledView>
                                <StyledText className="auth-wordmark">Budget</StyledText>
                                <StyledText className="auth-wordmark-sub">Track expenses</StyledText>
                            </StyledView>
                        </StyledView>
                    </StyledView>

                    <StyledView className="auth-card">
                        <StyledText className="auth-title">Welcome back</StyledText>
                        <StyledText className="auth-subtitle">
                            Sign in to continue tracking your subscriptions
                        </StyledText>

                        <StyledView className="auth-form mt-6">
                            <StyledView className="auth-field">
                                <StyledText className="auth-label">Email Address</StyledText>
                                <StyledTextInput
                                    className={`auth-input ${errors.fields.identifier ? 'auth-input-error' : ''}`}
                                    value={emailAddress}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#666666"
                                    onChangeText={setEmailAddress}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                                {errors.fields.identifier && (
                                    <StyledText className="auth-error mt-1">
                                        {errors.fields.identifier.message}
                                    </StyledText>
                                )}
                            </StyledView>

                            <StyledView className="auth-field">
                                <StyledText className="auth-label">Password</StyledText>
                                <StyledTextInput
                                    className={`auth-input ${errors.fields.password ? 'auth-input-error' : ''}`}
                                    value={password}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#666666"
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                    autoComplete="password"
                                />
                                {errors.fields.password && (
                                    <StyledText className="auth-error mt-1">
                                        {errors.fields.password.message}
                                    </StyledText>
                                )}
                            </StyledView>

                            <StyledPressable
                                className={`auth-button ${(!emailAddress || !password || fetchStatus === 'fetching') ? 'auth-button-disabled' : ''}`}
                                onPress={handleSubmit}
                                disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                            >
                                <StyledText className="auth-button-text">
                                    {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
                                </StyledText>
                            </StyledPressable>

                            <StyledView className="auth-divider-row">
                                <StyledView className="auth-divider-line" />
                                <StyledText className="auth-divider-text">OR</StyledText>
                                <StyledView className="auth-divider-line" />
                            </StyledView>

                            <StyledView className="auth-link-row">
                                <StyledText className="auth-link-copy">Don't have an account? </StyledText>
                                <Link href="/(auth)/sign-up">
                                    <StyledText className="auth-link">Sign Up</StyledText>
                                </Link>
                            </StyledView>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </ScrollView>
        </SafeAreaView>
    )
}