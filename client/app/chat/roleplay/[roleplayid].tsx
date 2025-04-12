import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Platform,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, get } from 'firebase/database';
import { db } from '../../../firebase';

import ChatBubble from '../../chat/ChatBubble';
import ChatInput from '../../chat/ChatInput';
import { getMessages, saveMessages, Message } from '../../chat/messageStorage';
import { SERVER_URL } from '../../../config';

type RolePlay = {
  id: string;
  title: string;
  description: string;
  character: string;
  avatar: string;
  prompt: string;
  cover: string;
  greet: string;
  greet_audio: string
};

export default function RolePlayChatScreen() {
  const { roleplayid } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
 
  const [rolePlay, setRolePlay] = useState<RolePlay | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRolePlay = async (id: string): Promise<RolePlay> => {
    const snapshot = await get(ref(db, `roleplay/${id}`));
    if (!snapshot.exists()) throw new Error('Roleplay not found');
    return snapshot.val();
  };

  useEffect(() => {
    if (!roleplayid || typeof roleplayid !== 'string') return;

    const init = async () => {
      try {
        const data = await fetchRolePlay(roleplayid);
        setRolePlay(data);
        if (messages.length === 0 && data.greet) {
          const greetingMsg: Message = {
            role: 'assistant',
            type: 'text',
            text: data.greet,
            timestamp: Date.now(),
            audioUri: data.greet_audio,
          };
          setMessages([greetingMsg]);
        }
    
      } catch (err) {
        console.error('❌ Failed to load roleplay:', err);
      }
    };

    init();
  }, [roleplayid]);

  // load navigation
  useEffect(() => {
    if (rolePlay === null) return;

    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{rolePlay.character}</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Image
          source={{ uri: rolePlay.avatar }}
          style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
        />
      ),
    });

    // history ignored here
  }, [rolePlay]);

  useEffect(() => {
    if (roleplayid && messages.length > 0 && typeof roleplayid === 'string') {
      saveMessages(roleplayid, messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !rolePlay || typeof roleplayid !== 'string') return;

    const userMsg: Message = {
      role: 'user',
      type: 'text',
      text: input,
      timestamp: Date.now(),
    };

    console.log('📤 Sending user message:', userMsg);

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: rolePlay.character,
          messages: messages.slice(-5),
          prompt: rolePlay.prompt,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: 'assistant',
        type: 'text',
        text: data.reply || 'No reply received.',
        timestamp: Date.now(),
        audioUri: data.audioUrl || undefined,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('❌ Backend error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          text: '⚠️ Failed to get response from server.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
    }

  };

  if (!rolePlay) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading role play...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatBubble
                message={item}
                avatar={item.role === 'assistant' ? rolePlay.avatar : undefined}
              />
            )}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ padding: 16 }}
          />
          <ChatInput
            input={input}
            onChange={setInput}
            onSend={sendMessage}
            onStartVoice={() => {
              console.log('🎙️ Start recording...');
            }}
            onStopVoice={() => {
              console.log('🛑 Stop recording...');
            }}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
