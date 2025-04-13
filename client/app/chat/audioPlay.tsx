import { Audio } from 'expo-av';

let currentSound: Audio.Sound | null = null;


export async function playAudioFromUri(
  uri: string,
  onPlaybackStatusUpdate?: (playing: boolean) => void
) {
  try {
    // If there's already a sound playing, stop and unload it first
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    currentSound = sound;

    if (onPlaybackStatusUpdate) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isPlaying' in status) {
          onPlaybackStatusUpdate(status.isPlaying);
          if (status.didJustFinish) {
            sound.unloadAsync();
            currentSound = null;
          }
        } else {
          console.error('Playback error:', status.error);
        }
      });
    }

    await sound.playAsync();
  } catch (err) {
    console.error('🔊 Failed to play audio:', err);
    if (onPlaybackStatusUpdate) onPlaybackStatusUpdate(false);
  }
}
