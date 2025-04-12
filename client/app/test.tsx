import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import ChatBubble from './chat/ChatBubble';

import type { Message } from './chat/types';

const mockMessage: Message = {
    role: 'assistant',
    type: 'text',
    content: 'Hello! How can I help you today?',
    audioUri: 'https://firebasestorage.googleapis.com/v0/b/character-coach.firebasestorage.app/o/mock-interview-greet.mp3?alt=media',
    timestamp: Date.now(),
  };

export default function TestChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ChatBubble message={mockMessage} avatar="https://i.pravatar.cc/100?img=5" />
      </ScrollView>
    </SafeAreaView>
  );
}
