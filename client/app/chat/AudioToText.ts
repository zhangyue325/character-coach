export const transcribeAudio = async (uri: string, serverUrl: string) => {
    const fileName = uri.split('/').pop()!;
    const fileType = 'audio/mp3'; // or 'audio/m4a' if you're recording m4a
  
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: fileType,
    } as any);
  
    const response = await fetch(`${serverUrl}/whisper`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data?.reply || 'Transcription failed');
    }
  
    return {
      text: data.reply,
      audioUrl: `${serverUrl}${data.audioUrl}`,
    };
  };
  