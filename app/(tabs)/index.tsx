import "@/global.css"
import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-xl font-bold text-success">
                Welcome to Nativewind!
            </Text>
            <Link href="/onboarding" className='mt-4 p-4 rounded bg-primary text-white'>Go to onboarding</Link>
            <Link href="/(auth)/sign-in" className='mt-4 p-4 rounded bg-primary text-white'>Go to Sign In</Link>
            <Link href="/(auth)/sign-up" className='mt-4 p-4 rounded bg-primary text-white'>Go to Sigh Up</Link>
            
            <Link href='/subscriptions'>Spotify Subscription</Link>
            <Link href={{
                pathname: '/subscriptions',
                params:{id:"claud"}
            }}>Claud Max Subscription</Link>

        </View>
    );
}