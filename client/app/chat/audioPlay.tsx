import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

let currentSound: Audio.Sound | null = null;

export async function playAudioFromUri(
  uri: string,
  onPlaybackStatusUpdate?: (playing: boolean) => void
) {
  try {
    // Unload any currently playing audio
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    let sourceUri = uri;

    // ✅ iOS workaround: download audio file first
    if (Platform.OS === 'ios' && uri.startsWith('http')) {
      try {
        const fileName = `temp-audio-${Date.now()}.mp3`;
        const localUri = FileSystem.documentDirectory + fileName;
        const downloadRes = await FileSystem.downloadAsync(uri, localUri);

        if (downloadRes.status !== 200) {
          throw new Error(`Download failed with status ${downloadRes.status}`);
        }

        sourceUri = downloadRes.uri;
        console.log('✅ Audio downloaded to:', sourceUri);

        // Optional: small delay to ensure iOS can read the file
        await new Promise((res) => setTimeout(res, 300));
      } catch (downloadErr) {
        console.error('❌ Failed to download audio before playback:', downloadErr);
        if (onPlaybackStatusUpdate) onPlaybackStatusUpdate(false);
        return;
      }
    }

    // ✅ Load and play audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: sourceUri },
      { shouldPlay: true }
    );

    currentSound = sound;

    // ✅ Playback status handling
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        console.error(
          `Playback error: not loaded. URI: ${uri}, Platform: ${Platform.OS}`,
          status
        );
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
