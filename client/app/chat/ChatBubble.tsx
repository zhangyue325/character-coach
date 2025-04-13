import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Message } from './types';
import { playAudioFromUri } from './audioPlay';
import TypingBubble from './TypingBubble';

export default function ChatBubble({
  message,
  avatar,
  isTyping,
  isRecording,
}: {
  message: Message;
  avatar?: string;
  isTyping?: boolean;
  isRecording?: boolean;
}) {
  const isUser = message.role === 'user';
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const playAudio = async () => {
    if (!message.audioUri) return;
    
    setLoading(true);
    await playAudioFromUri(message.audioUri, (isPlaying) => {
      setPlaying(isPlaying);
      setLoading(false);
    });
  };

  const onTranslate = () => {
    setModalMessage('Translation is WIP 🛠️');
    setModalVisible(true);
  };

  const onPractice = () => {
    setModalMessage('Practice is WIP 🛠️');
    setModalVisible(true);
  };

  // Helper function to check if audioUri is valid
  const hasAudio = () => {
    return message.audioUri && typeof message.audioUri === 'string' && message.audioUri.length > 0;
  };

  // Show typing indicator if this is an AI message and isTyping is true
  if (!isUser && isTyping) {
    return (
      <View style={[styles.container, { flexDirection: 'row' }]}>
        {avatar && (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        )}
        <TypingBubble visible={true} />
      </View>
    );
  }

  // Show recording indicator if this is a user message and isRecording is true
  if (isUser && isRecording) {
    return (
      <View style={[styles.container, { flexDirection: 'row-reverse' }]}>
        <View style={[styles.bubble, styles.user]}>
          <View style={styles.recordingContainer}>
            <ActivityIndicator size="small" color="#333" />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { flexDirection: isUser ? 'row-reverse' : 'row' }]}>
        {/* Avatar */}
        {!isUser && avatar && (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        )}

        {/* Message Block */}
        <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
          {typeof message.content === 'string' && message.content.trim() !== '' ? (
            <Text style={styles.text}>{message.content}</Text>
          ) : (
            <Text style={styles.text}>⚠️ Invalid or empty message</Text>
          )}

          <View style={styles.buttonRow}>
            {/* Left Button - Only show if valid audioUri exists */}
            {hasAudio() && !isUser && (
              <TouchableOpacity onPress={onTranslate} style={styles.iconButton}>
                <Ionicons name="language" size={15} color="#333" />
              </TouchableOpacity>
            )}
            
            {hasAudio() && isUser && (
              <TouchableOpacity onPress={onPractice} style={styles.iconButton}>
                <MaterialCommunityIcons name="microphone-outline" size={15} color="#333" />
              </TouchableOpacity>
            )}

            {/* Play Button - Only show if valid audioUri exists */}
            {hasAudio() && (
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
                    size={15}
                    color="#333"
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Modal for Translate or Practice */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
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
  text: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  iconButton: {
    marginRight: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 15,
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    maxHeight: '90%',
    minHeight: '90%',
    width: '100%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  recordingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});