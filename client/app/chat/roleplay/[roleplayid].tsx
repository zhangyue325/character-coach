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
import { Audio } from 'expo-av';

import ChatBubble from '../../chat/ChatBubble';
import ChatInput from '../../chat/ChatInput';
import { playAudioFromUri } from '../../chat/audioPlay';
import { transcribeAudio } from '../AudioToText'; 
import { SERVER_URL } from '../../../config';
import { db } from '../../../firebase';

import type { RolePlay, Message } from '../types';

export default function RolePlayChatScreen() {
  const { roleplayid } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [rolePlay, setRolePlay] = useState<RolePlay | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load roleplay data
  useEffect(() => {
    if (!roleplayid || typeof roleplayid !== 'string') return;

    const init = async () => {
      try {
        const snapshot = await get(ref(db, `roleplay/${roleplayid}`));
        if (!snapshot.exists()) throw new Error('Roleplay not found');
        const data = snapshot.val();
        setRolePlay(data);

        if (messages.length === 0 && data.greet) {
          // Show typing indicator briefly before adding the greeting message
          setIsTyping(true);
          setTimeout(() => {
            const greetingMsg: Message = {
              role: 'assistant',
              type: 'text',
              content: data.greet,
              timestamp: Date.now(),
              audioUri: data.greetaudio ?? '',
            };
            setMessages([greetingMsg]);
            setIsTyping(false);
            
            if (data.greetaudio) {
              playAudioFromUri(data.greetaudio);
            }
          }, 1500); // Show typing for 1.5 seconds
        }
      } catch (err) {
        console.error('❌ Failed to load roleplay:', err);
      }
    };

    init();
  }, [roleplayid]);

  // Setup navigation header
  useEffect(() => {
    if (!rolePlay) return;
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerTitle: () => <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{rolePlay.character}</Text>,
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
  }, [rolePlay]);

  // Start voice recording
  const onStartVoice = async () => {
    try {
      console.log('🎤 Start recording');
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) throw new Error('Permission not granted');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });    

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  // Stop voice recording
const onStopVoice = async () => {
  try {
    console.log('🛑 Stop recording');
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('🎧 Saved to', uri);
    setRecordedUri(uri);
    setRecording(null);

    // Immediately submit the audio
    if (uri) {
      onSubmit({
        text: '', // Empty text; the backend transcription will handle this
        audio: uri,
        mode: 'voice',
      });
    }
  } catch (err) {
    console.error('Failed to stop recording:', err);
  }
};

  // Handle submission from ChatInput
  const onSubmit = async ({
    text,
    audio,
    mode,
  }: {
    text: string;
    audio: string | null;
    mode: 'voice' | 'text';
  }) => {
    if (!rolePlay || typeof roleplayid !== 'string') return;

    let userText = text;
    let finalAudioUri = audio;

    if (mode === 'voice' && audio) {
      try {
        const result = await transcribeAudio(audio, SERVER_URL);
        userText = result.text || 'Voice transcription failed';
        finalAudioUri = result.audioUrl;
      } catch (err) {
        console.error('❌ Whisper transcription failed:', err);
        userText = '⚠️ Failed to transcribe voice';
      }
    }
  
    const userMsg: Message = {
      role: 'user',
      type: 'text',
      content: userText,
      timestamp: Date.now(),
      audioUri: finalAudioUri || null,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setRecordedUri(null);

    // Show AI typing indicator
    setIsTyping(true);
    setLoading(true);
    
    try {
      const formattedMessages = [...messages, userMsg].slice(-5).map(m => ({
        role: m.role,
        type: m.type,
        content: m.content,
        audioUri: m.audioUri,
        timestamp: m.timestamp,
      }));

      const res = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
          prompt: rolePlay.prompt,
        }),
      });

      const data = await res.json();
      
      // Disable typing indicator after a delay for more natural feel
      setTimeout(() => {
        setIsTyping(false);

        const aiMsg: Message = {
          role: 'assistant',
          type: 'text',
          content: data.text || 'No text received.',
          timestamp: Date.now(),
          audioUri: `${SERVER_URL}${data.audioUrl}` || '',
        };

        setMessages(prev => [...prev, aiMsg]);
        if (aiMsg.audioUri) {
          playAudioFromUri(aiMsg.audioUri);
        }
      }, 1000);
      
    } catch (err) {
      console.error('❌ Backend error:', err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          content: '⚠️ Failed to get response from server.',
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
            ListFooterComponent={() => (
              <>
                {/* Show typing indicator when AI is responding */}
                {isTyping && (
                  <ChatBubble
                    message={{ role: 'assistant', content: '', type: 'text', timestamp: Date.now() }}
                    avatar={rolePlay.avatar}
                    isTyping={true}
                  />
                )}
                {/* Show recording indicator when user is recording */}
                {recording && (
                  <ChatBubble
                    message={{ role: 'user', content: '', type: 'text', timestamp: Date.now() }}
                    isRecording={true}
                  />
                )}
              </>
            )}
          />
          <ChatInput
            input={input}
            onChange={setInput}
            onSubmit={onSubmit}
            onStartVoice={onStartVoice}
            onStopVoice={onStopVoice}
            loading={loading}
            recordedUri={recordedUri}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}