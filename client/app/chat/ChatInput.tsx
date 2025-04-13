import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  input: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onStartVoice: (e: GestureResponderEvent) => void;
  onStopVoice: (e: GestureResponderEvent) => void;
  loading: boolean;
};

export default function ChatInput({
  input,
  onChange,
  onSend,
  onStartVoice,
  onStopVoice,
  loading,
}: Props) {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');

  const toggleMode = () => {
    setMode(prev => (prev === 'voice' ? 'text' : 'voice'));
  };

  return (
    <View style={styles.container}>
      {/* Mode Switcher */}
      <TouchableOpacity style={styles.iconButton} onPress={toggleMode}>
        <Ionicons name={mode === 'voice' ? 'mic' : 'chatbubble'} size={24} color="#333" />
      </TouchableOpacity>

      {/* Input Area */}
      <View style={styles.middle}>
        {mode === 'text' ? (
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            value={input}
            onChangeText={onChange}
            editable={!loading}
          />
        ) : (
          <TouchableOpacity
            style={styles.voiceBar}
            onPressIn={onStartVoice}
            onPressOut={onStopVoice}
          >
            <Text style={styles.voiceText}>🎤 Hold to speak</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[styles.sendButton, loading && { opacity: 0.5 }]}
        onPress={onSend}
        disabled={loading || (mode === 'text' && !input.trim())}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 8,
  },
  middle: {
    flex: 1,
    marginHorizontal: 10,
  },
  textInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  voiceBar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  voiceText: {
    color: '#555',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#007aff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});