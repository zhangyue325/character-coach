import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, Alert } from 'react-native';

import { Audio } from 'expo-av';
import { transcribeAudio } from '../chat/AudioToText'; // adjust import path
import { SERVER_URL } from '../../config'; // update to your server

export default function WhisperTest() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log('🎙️ Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('✅ Recording saved to', uri);
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleTranscribe = async () => {
    if (!recordedUri) {
      Alert.alert('No recording to transcribe');
      return;
    }

    setLoading(true);
    try {
      const result = await transcribeAudio(recordedUri, SERVER_URL);
      setResult(result.text);
      console.log('🧠 Transcribed:', result);
    } catch (err: any) {
      console.error('❌ Transcription error:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <View style={{ height: 16 }} />
      <Button title="Transcribe" onPress={handleTranscribe} disabled={!recordedUri || loading} />
      <View style={{ marginTop: 20 }}>
        {loading && <ActivityIndicator />}
        {result ? <Text>📝 Transcript: {result}</Text> : null}
      </View>
    </View>
  );
}
