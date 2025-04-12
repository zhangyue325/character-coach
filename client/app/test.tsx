import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import ChatBubble from './chat//ChatBubble'; // adjust path as needed
import type { Message } from './chat/types';

export default function ChatBubbleTest() {
  const mockMessages: Message[] = [
    {
      role: 'assistant',
      type: 'text',
      text: "Hi! I'm David, your waiter for today.",
      timestamp: Date.now(),
      audioUri: 'https://actions.google.com/sounds/v1/animals/small_dog_wimper_series.ogg', 
    },
    {
      role: 'user',
      type: 'text',
      text: "I'd like to order a coffee.",
      timestamp: Date.now(),
      audioUri: 'https://actions.google.com/sounds/v1/animals/small_dog_wimper_series.ogg',       
    },
    {
      role: 'assistant',
      type: 'text',
      text: "Would you like cream or sugar with that?",
      timestamp: Date.now(),
      audioUri: 'https://actions.google.com/sounds/v1/animals/small_dog_wimper_series.ogg',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {mockMessages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg}
            avatar={
              msg.role === 'assistant'
                ? 'https://randomuser.me/api/portraits/men/32.jpg'
                : undefined
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
