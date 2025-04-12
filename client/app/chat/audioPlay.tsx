import { Audio } from 'expo-av';

export async function playAudioFromUri(
  uri: string,
  onPlaybackStatusUpdate?: (playing: boolean) => void
) {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    if (onPlaybackStatusUpdate) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isPlaying' in status) {
          onPlaybackStatusUpdate(status.isPlaying);
          if (status.didJustFinish) {
            sound.unloadAsync();
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
