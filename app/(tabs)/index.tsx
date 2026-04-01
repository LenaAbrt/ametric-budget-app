import "@/global.css"
import { Text } from "react-native";
import {Link} from "expo-router";
import {styled} from 'nativewind';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)
export default function App() {
    return (
        <SafeAreaView className='flex-1 bg-background p-5'>
            <Text className="text-5xl font-sans-extrabold text-primary">
                Home
            </Text>
            <Link href="/onboarding" className='mt-4 p-4 font-sans-semibold rounded bg-primary text-white'>Go to onboarding</Link>
            <Link href="/(auth)/sign-in" className='mt-4 p-4 font-sans-semibold rounded bg-primary text-white'>Go to Sign In</Link>
            <Link href="/(auth)/sign-up" className='mt-4 p-4 font-sans-semibold rounded bg-primary text-white'>Go to Sigh Up</Link>

        </SafeAreaView>
    );
}