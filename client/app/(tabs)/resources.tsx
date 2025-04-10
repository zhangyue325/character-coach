import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import * as FileSystem from 'expo-file-system';

async function uploadToFirebase(localUri: string): Promise<string | null> {
  try {
    const response = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const filename = localUri.split('/').pop() || `tts-${Date.now()}.mp3`;
    const storageRef = ref(storage, `tts/${filename}`);

    const blob = await base64ToBlob(response, 'audio/mpeg');

    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('✅ Uploaded to Firebase:', downloadURL);
    return downloadURL;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
}

// Helper to convert base64 -> Blob
async function base64ToBlob(base64Data: string, contentType: string): Promise<Blob> {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
