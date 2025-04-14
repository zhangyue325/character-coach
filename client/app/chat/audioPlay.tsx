import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

let currentSound: Audio.Sound | null = null;

export async function playAudioFromUri(
  uri: string,
  onPlaybackStatusUpdate?: (playing: boolean) => void
) {
  try {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    let sourceUri = uri;

    // ✅ iOS workaround: download to local first
    if (Platform.OS === 'ios' && uri.startsWith('http')) {
      try {
        const localUri = FileSystem.documentDirectory + 'temp-audio.mp3';
        const downloadRes = await FileSystem.downloadAsync(uri, localUri);
        sourceUri = downloadRes.uri;
        console.log('✅ Audio downloaded to', sourceUri);
      } catch (downloadErr) {
        console.error('❌ Failed to download audio before playback:', downloadErr);
      }
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: sourceUri },
      { shouldPlay: true }
    );

    currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        console.error(`Playback error: not loaded. URI: ${uri}, Platform: ${Platform.OS}`, status);
        if (onPlaybackStatusUpdate) onPlaybackStatusUpdate(false);
        return;
      }

      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate(status.isPlaying);
      }

      if (status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
        if (onPlaybackStatusUpdate) onPlaybackStatusUpdate(false);
      }
    });
  } catch (err) {
    console.error('🔊 Failed to play audio:', err);
    if (onPlaybackStatusUpdate) onPlaybackStatusUpdate(false);
  }
}
