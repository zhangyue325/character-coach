import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import ChatBubble from './chat//ChatBubble'; // adjust path as needed
import type { Message } from './chat/messageStorage';

export default function ChatBubbleTest() {
  const mockMessages: Message[] = [
    {
      role: 'assistant',
      type: 'text',
      text: "Hi! I'm David, your waiter for today.",
      timestamp: Date.now(),
      audioUri: 'https://file-examples.com/storage/fee47d30d267f6756977e34/2017/11/file_example_MP3_700KB.mp3', 
    },
    {
      role: 'user',
      type: 'text',
      text: "I'd like to order a coffee.",
      timestamp: Date.now(),
      audioUri: 'https://file-examples.com/storage/fee47d30d267f6756977e34/2017/11/file_example_MP3_700KB.mp3',       
    },
    {
      role: 'assistant',
      type: 'text',
      text: "Would you like cream or sugar with that?",
      timestamp: Date.now(),
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
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
