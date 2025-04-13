import { Audio, AVPlaybackStatus } from 'expo-av';

let currentSound: Audio.Sound | null = null;

export async function playAudioFromUri(
  uri: string,
  onPlaybackStatusUpdate?: (playing: boolean) => void
) {
  try {
    // Clean up any previous sound
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }  // ✅ This auto-plays immediately
    );

    currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        console.error('Playback error:', status.error);
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
