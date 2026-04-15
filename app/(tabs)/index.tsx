import "@/global.css"
import {FlatList, Image, Text, View, Pressable} from "react-native";
import {Link, useRouter} from "expo-router";
import {styled} from 'nativewind';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import images from "@/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";
import {useUser} from "@clerk/expo";
import {useSubscriptions} from "../../context/SubscriptionsContext";

const SafeAreaView = styled(RNSafeAreaView)
export default function Index() {
    const { user } = useUser()
    const router = useRouter()
    const [expandedSubscriptionIs, setExpandedSubscriptionId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { subscriptions, addSubscription } = useSubscriptions();
    
    const displayName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'
    
    const handleViewAllSubscriptions = () => {
        router.push('/(tabs)/subscriptions');
    };
    
    const handleCreateSubscription = (newSubscription: Subscription) => {
        addSubscription(newSubscription);
    };
    
    return (
        <SafeAreaView className='flex-1 bg-background p-5'>
                <FlatList data={subscriptions}
                          ListHeaderComponent={()=>(
                              <>
                                  <View className='home-header'>
                                      <View className='home-user'>
                                          <Image source={images.avatar} className='home-avatar'/>
                                          <Text className='home-user-name'>{displayName}</Text>
                                      </View>

                                      <Pressable onPress={() => setShowCreateModal(true)}>
                                          <Image source={icons.add} className='home-add-icon'/>
                                      </Pressable>
                                  </View>

                                  <View className='home-balance-card'>
                                      <Text className='home-balance-label'>Balance</Text>

                                      <View className='home-balance-row'>
                                          <Text className='home-balance-amount'>
                                              {formatCurrency(HOME_BALANCE.amount)}
                                          </Text>
                                          <Text className='home-balance-date'>
                                              {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}

                                          </Text>
                                      </View>
                                  </View>

                                  <View className='mb-5'>
                                      <ListHeading title='Upcoming'/>
                                      <FlatList data={UPCOMING_SUBSCRIPTIONS}
                                                renderItem={({item}) => (
                                                    <UpcomingSubscriptionCard {...item}/>
                                                )}
                                                keyExtractor={(item) => item.id}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                ListEmptyComponent={
                                                    <Text className='home-empty-state'>
                                                        No upcoming renewals
                                                    </Text>
                                                }
                                      />
                                  </View>

                                  <ListHeading title='All Subscriptions' onPress={handleViewAllSubscriptions}/>

                              </>
                          )}
                          keyExtractor={(item) => item.id}
                          renderItem={({item}) => (
                              <SubscriptionCard
                                  {...item}
                                  expanded={expandedSubscriptionIs === item.id}
                                  onPress={() => setExpandedSubscriptionId((currentId) => (
                                      currentId === item.id ? null : item.id
                                  ))}
                              />
                          )}
                          extraData={expandedSubscriptionIs}
                          ItemSeparatorComponent={()=><View className='h-4'/> }
                          showsVerticalScrollIndicator={false}
                          ListEmptyComponent={
                              <Text className='home-empty-state'>
                                  No subscriptions
                              </Text>
                          }
                          contentContainerClassName='pb-20'
                />

                <CreateSubscriptionModal
                    visible={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateSubscription}
                />
        </SafeAreaView>
    );
}