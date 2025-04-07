import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { fetchCharacter } from './characterApi';
import { getMessages, saveMessages } from './messageStorage';
import type { Character, Message } from './types';
import { SERVER_URL } from '../../config';

export default function CharacterChatScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    const loadCharacter = async () => {
      try {
        const data = await fetchCharacter(id);
        setCharacter(data);
      } catch (err) {
        console.error('Error loading character:', err);
      }
    };
    loadCharacter();
  }, [id]);

  useEffect(() => {
    if (!character || typeof id !== 'string') return;

    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: character.avatar }}
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{character.name}</Text>
        </View>
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });

    const loadHistory = async () => {
      const stored = await getMessages(id);
      if (stored.length > 0) {
        setMessages(stored);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: `Hi! I'm ${character.name}, your ${character.role}. Let's practice English!`,
          },
        ]);
      }
    };

    loadHistory();
  }, [character]);

  useEffect(() => {
    if (id && messages.length > 0) {
      saveMessages(id as string, messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !character || typeof id !== 'string') return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: id,
          messages: [...messages, userMsg].slice(-5),
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: 'assistant',
        content: data.reply || 'No reply received.',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error from backend:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Failed to get response from server.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  if (!character) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading character...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={({ item }) => (
        <ChatBubble
          message={item}
          avatar={item.role === 'assistant' ? character.avatar : undefined}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
    />
      <ChatInput input={input} onChange={setInput} onSend={sendMessage} loading={loading} />
    </SafeAreaView>
  );
}
