import React, { useState } from 'react';
import {Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants/icons';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CATEGORIES = [
  'Entertainment',
  'AI Tools', 
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other'
];

const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': '#f5c542',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#b8e8d0',
  'Cloud': '#d4e8f5',
  'Music': '#f5d4e8',
  'Other': '#e8e8e8'
};

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !price || parseFloat(price) <= 0 || !category) {
      return;
    }

    const startDate = new Date().toISOString();
    const renewalDate = frequency === 'Monthly' 
      ? dayjs().add(1, 'month').toISOString()
      : dayjs().add(1, 'year').toISOString();

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: parseFloat(price),
      currency: 'USD',
      billing: frequency,
      category,
      status: 'active',
      startDate,
      renewalDate,
      icon: icons.wallet,
      color: CATEGORY_COLORS[category] || '#e8e8e8',
      paymentMethod: 'Not provided',
      plan: frequency
    };

    onSubmit(newSubscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('');
  };

  const isFormValid = name.trim() && price && parseFloat(price) > 0 && category;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background pt-12"
      >
        <View className="flex-1">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable className="modal-close" onPress={onClose}>
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>
          
          <ScrollView 
          className="modal-body pb-40"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ flexGrow: 1 }}
        >
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                className="auth-input"
                value={name}
                onChangeText={setName}
                placeholder="Enter subscription name"
                placeholderTextColor="#999"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                className="auth-input"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#999"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                <Pressable
                  className={clsx(
                    'picker-option',
                    frequency === 'Monthly' && 'picker-option-active'
                  )}
                  onPress={() => setFrequency('Monthly')}
                >
                  <Text className={clsx(
                    'picker-option-text',
                    frequency === 'Monthly' && 'picker-option-text-active'
                  )}>
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  className={clsx(
                    'picker-option',
                    frequency === 'Yearly' && 'picker-option-active'
                  )}
                  onPress={() => setFrequency('Yearly')}
                >
                  <Text className={clsx(
                    'picker-option-text',
                    frequency === 'Yearly' && 'picker-option-text-active'
                  )}>
                    Yearly
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    className={clsx(
                      'category-chip',
                      category === cat && 'category-chip-active'
                    )}
                    onPress={() => setCategory(cat)}
                  >
                    <Text className={clsx(
                      'category-chip-text',
                      category === cat && 'category-chip-text-active'
                    )}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              className={clsx(
                'auth-button',
                !isFormValid && 'auth-button-disabled'
              )}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
