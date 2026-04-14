import { Text, View, Pressable, Alert } from 'react-native'
import { styled } from 'nativewind'
import { useUser, useClerk } from '@clerk/expo'
import { Link } from 'expo-router'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/constants/theme'
// import { usePostHog } from 'posthog-react-native';

const SafeAreaView = styled(RNSafeAreaView)
const StyledView = styled(View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)

export default function OnboardingScreen() {
    const { user } = useUser()
    const { signOut } = useClerk()
    const insets = useSafeAreaInsets()

    // const posthog = usePostHog();

    const handleSignOut = async () => {
        // posthog.capture('user_signed_out');
        try {
            await signOut();
            // posthog.reset();
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-background"
            style={{ paddingTop: insets.top }}
        >
            <StyledView className="flex-1 px-5">
                <StyledView className="flex-row items-center justify-between py-4">
                    <StyledText className="text-2xl font-sans-bold text-primary">
                        Profile
                    </StyledText>
                    <Link href="/(tabs)">
                        <StyledText className="text-base font-sans-semibold text-accent">
                            Done
                        </StyledText>
                    </Link>
                </StyledView>

                <StyledView className="flex-1 items-center justify-center">
                    <StyledView className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-accent">
                        <StyledText className="text-3xl font-sans-extrabold text-background">
                            {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                        </StyledText>
                    </StyledView>

                    <StyledText className="mb-2 text-2xl font-sans-bold text-primary">
                        {user?.firstName || 'User'}
                    </StyledText>

                    <StyledText className="mb-8 text-center text-base font-sans-medium text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress}
                    </StyledText>

                    <StyledView className="w-full gap-4 rounded-2xl border border-border bg-card p-5">
                        <StyledView className="flex-row items-center justify-between">
                            <StyledText className="text-base font-sans-semibold text-primary">
                                Account Status
                            </StyledText>
                            <StyledText className="text-base font-sans-medium text-success">
                                Active
                            </StyledText>
                        </StyledView>

                        <StyledView className="flex-row items-center justify-between">
                            <StyledText className="text-base font-sans-semibold text-primary">
                                Member Since
                            </StyledText>
                            <StyledText className="text-base font-sans-medium text-muted-foreground">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </StyledText>
                        </StyledView>
                    </StyledView>
                </StyledView>

                <StyledView className="pb-8">
                    <StyledPressable
                        className="items-center rounded-2xl bg-destructive py-4"
                        onPress={handleSignOut}
                    >
                        <StyledText className="text-base font-sans-bold text-background">
                            Sign Out
                        </StyledText>
                    </StyledPressable>
                </StyledView>
            </StyledView>
        </SafeAreaView>
    )
}
