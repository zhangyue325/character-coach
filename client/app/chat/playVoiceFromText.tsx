// utils/playVoiceFromText.ts
import { Audio } from 'expo-av';

export const playVoiceFromText = async (text: string, voiceId: string, apiKey: string) => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': 'sk_05fb0705f00451002dc97fd00eb53c7829d3c4fbe9fb40c7',
        'accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    const blob = await response.blob();
    const uri = URL.createObjectURL(blob);

    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  } catch (err) {
    console.error('🎧 Error playing ElevenLabs voice:', err);
  }
};
