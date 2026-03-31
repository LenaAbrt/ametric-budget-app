import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Link} from "expo-router";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
        <Link href="/(auth)/sign-in">Sign in</Link>
        <Link href="/" className='mt-4 p-4 rounded bg-primary text-white'>Go back</Link>

    </View>
  );
};

export default SignIn;