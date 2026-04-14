import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {formatCurrency, formatSubscriptionDateTime, formatStatusLabel} from "@/lib/utils";
import clsx from 'clsx';
import {countLinesAndTerminateMap} from "@expo/metro-config/build/transform-worker/count-lines";

const SubscriptionCard = ({name, price, billing, category, plan, renewalDate, icon, currency, paymentMethod, onPress, color, expanded, startDate, status}: SubscriptionCardProps) => {
  return (
    <Pressable onPress={onPress} className={clsx('sub-card', expanded ? 'sub-card-expanded' : 'bg-card')} style={! expanded && color ? {backgroundColor: color} : undefined}>
      <View className='sub-head'>
          <View className='sub-main'>
              <Image source={icon} className='sub-icon' />
              <View className='sub-copy'>
                  <Text numberOfLines={1} className='sub-title'>{name}</Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" className='sub-meta'>
                      {
                          category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')
                      }
                  </Text>
              </View>
          </View>
          <View className='sub-price-box'>
              <Text className='sub-price'>{formatCurrency(price, currency)}</Text>
              <Text className='sub-billing'>{billing}</Text>
          </View>
      </View>
        {expanded && (
            <View className='sub-body'>
                <View className='sub-details'>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Payment:</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail'
                                  className='sub-value'>
                                {paymentMethod?.trim() ?? 'Not provided'}
                            </Text>
                        </View>
                    </View>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Cathegory:</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail'
                                  className='sub-value'>
                                {category?.trim() || plan?.trim()}
                            </Text>
                        </View>
                    </View>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Started:</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail'
                                  className='sub-value'>
                                {startDate ? formatSubscriptionDateTime(startDate) : ''}
                            </Text>
                        </View>
                    </View>
                    <View className="sub-row">
                        <View className="sub-row-copy">
                            <Text className="sub-label">Renewal date:</Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{renewalDate ? formatSubscriptionDateTime(renewalDate) : 'Not provided'}</Text>
                        </View>
                    </View>
                    <View className="sub-row">
                        <View className="sub-row-copy">
                            <Text className="sub-label">Status:</Text>
                            <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{status ? formatStatusLabel(status) : 'Not provided'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        ) }
    </Pressable>
  );
};

export default SubscriptionCard;