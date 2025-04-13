import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import ChatInput from '../chat/ChatInputTest'; // Adjust path
import { Audio } from 'expo-av';

export default function ChatInputTest() {
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<{
    text: string;
    audio: string | null;
    mode: 'voice' | 'text';
  } | null>(null);

  const onStartVoice = async () => {
    try {
      console.log('🎤 Start recording');
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) throw new Error('Permission not granted');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const onStopVoice = async () => {
    try {
      console.log('🛑 Stop recording');
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('🎧 Saved to', uri);
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const onSubmit = ({ text, audio, mode }: { text: string; audio: string | null; mode: 'voice' | 'text' }) => {
    console.log('✅ Submitted:', { text, audio, mode });
    setLastSubmitted({ text, audio, mode });
    setInput('');
    setRecordedUri(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewBox}>
        <Text style={styles.label}>🧪 ChatInput Test (with real audio)</Text>
        {lastSubmitted && (
          <View style={styles.output}>
            <Text>Mode: {lastSubmitted.mode}</Text>
            <Text>Text: {lastSubmitted.text}</Text>
            <Text>Audio: {lastSubmitted.audio ?? 'None'}</Text>
          </View>
        )}
      </View>

      <ChatInput
        input={input}
        onChange={setInput}
        onSubmit={onSubmit}
        onStartVoice={onStartVoice}
        onStopVoice={onStopVoice}
        loading={false}
        recordedUri={recordedUri}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fafafa',
  },
  previewBox: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  output: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
  },
});
