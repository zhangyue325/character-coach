import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import type { Message } from './messageStorage';

export default function ChatBubble({
  message,
  avatar,
}: {
  message: Message;
  avatar?: string; // optional
}) {
  const isUser = message.role === 'user';

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
        {message.type === 'text' && <Text>{message.text}</Text>}
        {message.type === 'audio' && (
          <Text style={{ fontStyle: 'italic', color: '#555' }}>🔊 Voice message</Text>
        )}
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
  },
  user: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  ai: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
});