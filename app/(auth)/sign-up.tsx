import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Link} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>SignUp</Text>
            <Link href="/(auth)/sign-up">Create account</Link>
        </View>
    );
};

export default SignUp;