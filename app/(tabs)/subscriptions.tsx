import React, { useState, useMemo } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import {styled} from 'nativewind';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import {formatCurrency, formatSubscriptionDateTime, formatStatusLabel} from "@/lib/utils";
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptions } from '../../context/SubscriptionsContext';

const SafeAreaView = styled(RNSafeAreaView)

function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState('');
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return subscriptions;
    }

    const query = searchQuery.toLowerCase();
    return subscriptions.filter(subscription => 
      subscription.name.toLowerCase().includes(query) ||
      subscription.category?.toLowerCase().includes(query) ||
      subscription.plan?.toLowerCase().includes(query) ||
      subscription.paymentMethod?.toLowerCase().includes(query)
    );
  }, [searchQuery, subscriptions]);

  const renderSubscription = ({ item }: { item: any }) => (
    <SubscriptionCard
      {...item}
      expanded={false}
      onPress={() => {}}
    />
  );

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='p-5'>
        <Text className='text-2xl font-bold text-foreground mb-4'>Subscriptions</Text>
        
        <View className='auth-field mb-4'>
          <Text className='auth-label'>Search</Text>
          <View className='relative'>
            <TextInput
              className='auth-input pr-12'
              placeholder='Search subscriptions...'
              placeholderTextColor='#999'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                className='absolute right-4 top-4'
                onPress={() => setSearchQuery('')}
              >
                <Text className='text-muted-foreground text-lg'>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscription}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{height: 16}} />}
          ListEmptyComponent={() => (
            <View className='flex-1 items-center justify-center mt-10'>
              <Text className='text-muted-foreground text-center'>
                {searchQuery.trim() 
                  ? `No subscriptions found for "${searchQuery}"`
                  : 'No subscriptions available'
                }
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default Subscriptions;