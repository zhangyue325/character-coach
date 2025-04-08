import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  input: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onVoicePress: () => void; // ✅ new prop
  loading: boolean;
};

export default function ChatInput({
  input,
  onChange,
  onSend,
  onVoicePress,
  loading,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={styles.inputBar}
    >
      {/* 🎙️ Voice input button */}
      <TouchableOpacity style={styles.voiceButton} onPress={onVoicePress}>
        <Ionicons name="mic-outline" size={24} color="#555" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={input}
        onChangeText={onChange}
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSend}
        disabled={loading || !input.trim()}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  voiceButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
