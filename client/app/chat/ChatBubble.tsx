import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Message } from './messageStorage';

export default function ChatBubble({
  message,
  avatar,
}: {
  message: Message;
  avatar?: string;
}) {
  const isUser = message.role === 'user';
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playAudio = async () => {
    if (!message.audioUri) return;
    setLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: message.audioUri });
      setPlaying(true);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (!status.isPlaying) {
          setPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.error('❌ Failed to play audio:', err);
    } finally {
      setLoading(false);
    }
  };

  const onTranslate = () => {
    Alert.alert('🌍 Translate', `Translating: "${message.text}"`);
  };

  const onPractice = () => {
    Alert.alert('🗣️ Practice', `Let's practice saying: "${message.text}"`);
  };

  return (
    <View
      style={[
        styles.container,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      {!isUser && avatar && (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      )}
      <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
        <Text style={styles.text}>{message.text}</Text>

        <View style={styles.buttonRow}>
          {/* Left-side Button */}
          {message.audioUri && !isUser && (
            <TouchableOpacity onPress={onTranslate} style={styles.iconButton}>
              <Ionicons name="language" size={18} color="#333" />
            </TouchableOpacity>
          )}
          {message.audioUri && isUser && (
            <TouchableOpacity onPress={onPractice} style={styles.iconButton}>
              <MaterialCommunityIcons name="microphone-outline" size={18} color="#333" />
            </TouchableOpacity>
          )}

          {/* Audio Play Button */}
          {message.audioUri && (
            <TouchableOpacity
              onPress={playAudio}
              disabled={loading}
              style={styles.iconButton}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <Ionicons
                  name={playing ? 'pause' : 'volume-high'}
                  size={18}
                  color="#333"
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  bubble: {
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
    position: 'relative',
  },
  user: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  ai: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
  },
  iconButton: {
    marginRight: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 15,
    padding: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 6,
  },

});
