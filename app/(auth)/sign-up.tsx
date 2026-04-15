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
import { useAuth, useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { Linking } from 'react-native'

const SafeAreaView = styled(RNSafeAreaView)
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledPressable = styled(Pressable)

export default function SignUpScreen() {
    const { signUp, errors, fetchStatus } = useSignUp()
    const { isSignedIn } = useAuth()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [showVerification, setShowVerification] = useState(false)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePassword = (password: string) => {
        return password.length >= 8
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

        if (!validatePassword(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long')
            return
        }

        try {
            const { error } = await signUp.password({
                emailAddress,
                password,
            })
            
            if (error) {
                Alert.alert('Error', error.message)
                return
            }

            if (!error) {
                await signUp.verifications.sendEmailCode()
                setShowVerification(true)
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Something went wrong')
        }
    }

    const handleVerify = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter the verification code')
            return
        }

        try {
            await signUp.verifications.verifyEmailCode({
                code,
            })
            
            if (signUp.status === 'complete') {
                await signUp.finalize({
                    navigate: ({ session }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask)
                            return
                        }

                        router.replace('/(tabs)/index')
                    },
                })
            } else {
                Alert.alert('Error', 'Sign-up attempt not complete')
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Invalid verification code')
        }
    }

    const handleResendCode = async () => {
        try {
            await signUp.verifications.sendEmailCode()
            Alert.alert('Success', 'A new verification code has been sent to your email')
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to resend code')
        }
    }

    if (signUp.status === 'complete' || isSignedIn) {
        return null
    }

    if (showVerification || (
        signUp.status === 'missing_requirements' &&
        signUp.unverifiedFields.includes('email_address') &&
        signUp.missingFields.length === 0
    )) {
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
                            <StyledText className="auth-title">Verify your email</StyledText>
                            <StyledText className="auth-subtitle">
                                We've sent a verification code to {emailAddress}
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
                                    onPress={handleVerify}
                                    disabled={!code || fetchStatus === 'fetching'}
                                >
                                    <StyledText className="auth-button-text">
                                        {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify Email'}
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
                        <StyledText className="auth-title">Create account</StyledText>
                        <StyledText className="auth-subtitle">
                            Start tracking your subscriptions and expenses
                        </StyledText>

                        <StyledView className="auth-form mt-6">
                            <StyledView className="auth-field">
                                <StyledText className="auth-label">Email Address</StyledText>
                                <StyledTextInput
                                    className={`auth-input ${errors.fields.emailAddress ? 'auth-input-error' : ''}`}
                                    value={emailAddress}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#666666"
                                    onChangeText={setEmailAddress}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                                {errors.fields.emailAddress && (
                                    <StyledText className="auth-error mt-1">
                                        {errors.fields.emailAddress.message}
                                    </StyledText>
                                )}
                            </StyledView>

                            <StyledView className="auth-field">
                                <StyledText className="auth-label">Password</StyledText>
                                <StyledTextInput
                                    className={`auth-input ${errors.fields.password ? 'auth-input-error' : ''}`}
                                    value={password}
                                    placeholder="Create a password (min. 8 characters)"
                                    placeholderTextColor="#666666"
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                    autoComplete="password-new"
                                />
                                {errors.fields.password && (
                                    <StyledText className="auth-error mt-1">
                                        {errors.fields.password.message}
                                    </StyledText>
                                )}
                                <StyledText className="auth-helper mt-1">
                                    Password must be at least 8 characters long
                                </StyledText>
                            </StyledView>

                            <StyledPressable
                                className={`auth-button ${(!emailAddress || !password || fetchStatus === 'fetching') ? 'auth-button-disabled' : ''}`}
                                onPress={handleSubmit}
                                disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                            >
                                <StyledText className="auth-button-text">
                                    {fetchStatus === 'fetching' ? 'Creating Account...' : 'Create Account'}
                                </StyledText>
                            </StyledPressable>

                            <StyledView className="auth-divider-row">
                                <StyledView className="auth-divider-line" />
                                <StyledText className="auth-divider-text">OR</StyledText>
                                <StyledView className="auth-divider-line" />
                            </StyledView>

                            <StyledView className="auth-link-row">
                                <StyledText className="auth-link-copy">Already have an account? </StyledText>
                                <Link href="/(auth)/sign-in">
                                    <StyledText className="auth-link">Sign In</StyledText>
                                </Link>
                            </StyledView>
                        </StyledView>
                    </StyledView>

                    <StyledView nativeID="clerk-captcha" />
                </StyledView>
            </ScrollView>
        </SafeAreaView>
    )
}