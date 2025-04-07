import { View, TextInput, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import React from 'react';

export default function ChatInput({ input, onChange, onSend, loading }: any) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={styles.inputBar}
    >
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={input}
        onChangeText={onChange}
      />
      <Button title={loading ? '...' : 'Send'} onPress={onSend} disabled={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
});
