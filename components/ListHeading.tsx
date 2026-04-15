import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ListHeading = ({title, onPress}: ListHeadingProps & {onPress?: () => void}) => {
    return (
        <View className='list-head'>
            <Text className='list-title'>{title}</Text>

            <TouchableOpacity className='list-action' onPress={onPress}>
                <Text className='list-action-text'>View all</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ListHeading;