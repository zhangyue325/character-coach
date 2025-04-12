import { db, auth } from '../../firebase';
import { ref, get, set } from 'firebase/database';
import type { Message } from './types';


const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

export const getMessages = async (characterId: string): Promise<Message[]> => {
  try {
    const userId = getUserId();
    const path = `messages/${userId}/${characterId}`;
    const snapshot = await get(ref(db, path));

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Firebase might return an object if data was saved as {0: {...}, 1: {...}} instead of an array
      if (Array.isArray(data)) {
        return data;
      } else {
        return Object.values(data) as Message[];
      }
    } else {
      return [];
    }
  } catch (err) {
    console.error('getMessages error:', err);
    return [];
  }
};


export const saveMessages = async (characterId: string, messages: Message[]) => {
  try {
    const userId = getUserId();
    const path = `messages/${userId}/${characterId}`;
    await set(ref(db, path), messages);
  } catch (err) {
    console.error('saveMessages error:', err);
  }
};

