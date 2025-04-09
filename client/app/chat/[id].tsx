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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase';

import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { getMessages, saveMessages, Message } from './messageStorage';
import { SERVER_URL } from '../../config';

type Character = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  prompt: string;
  greet: string;
};

export default function CharacterChatScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCharacter = async (charId: string): Promise<Character> => {
    const snapshot = await get(ref(db, `characters/${charId}`));
    if (!snapshot.exists()) throw new Error('Character not found');
    return snapshot.val();
  };

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const init = async () => {
      try {
        const data = await fetchCharacter(id);
        setCharacter(data);
      } catch (err) {
        console.error('❌ Failed to load character:', err);
      }
    };

    init();
  }, [id]);

  useEffect(() => {
    if (!character || typeof id !== 'string') return;

    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{character.name}</Text>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Image
          source={{ uri: character.avatar }}
          style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
        />
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
            type: 'text',
            text: character.greet,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    loadHistory();
  }, [character]);

  useEffect(() => {
    if (id && messages.length > 0 && typeof id === 'string') {
      saveMessages(id, messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !character || typeof id !== 'string') return;

    const userMsg: Message = {
      role: 'user',
      type: 'text',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: id,
          messages: messages.slice(-5),
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: 'assistant',
        type: 'text',
        text: data.reply || 'No reply received.',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('❌ Error from backend:', err);
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

  const handleVoicePress = () => {
    Alert.alert('🎤 Voice mode', 'Start voice input (recording not implemented yet)');
    // You can replace this with voice SDK logic (e.g., react-native-voice)
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
                avatar={item.role === 'assistant' ? character.avatar : undefined}
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
              // TODO: Start voice SDK recording
            }}
            onStopVoice={() => {
              console.log('🛑 Stop recording...');
              // TODO: Stop recording and process result
            }}
            loading={loading}
          />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
