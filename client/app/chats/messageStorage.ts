import type { Message } from './types';
import { db, auth } from '../../firebase';
import { ref, get, set } from 'firebase/database';

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
      return snapshot.val();
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
