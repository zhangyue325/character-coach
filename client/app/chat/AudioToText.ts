export const transcribeAudio = async (uri: string, serverUrl: string) => {
    const fileName = uri.split('/').pop()!;
    const fileType = 'audio/m4a'; 
  
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
      throw new Error(data?.text || 'Transcription failed');
    }
  
    return {
      text: data.text,
      audioUrl: `${serverUrl}${data.audioUrl}`,
    };
  };
  