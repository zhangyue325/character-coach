import type { Message } from './types';
import { SERVER_URL } from '../../config';
import { auth } from '../../firebase';

const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

export const getMessages = async (characterId: string): Promise<Message[]> => {
  try {
    const userId = getUserId();
    const res = await fetch(`${SERVER_URL}/history/${userId}/${characterId}`);
    if (!res.ok) throw new Error('Failed to load history');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('getMessages error:', err);
    return [];
  }
};

export const saveMessages = async (characterId: string, messages: Message[]) => {
  try {
    const userId = getUserId();
    await fetch(`${SERVER_URL}/history/${userId}/${characterId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
  } catch (err) {
    console.error('saveMessages error:', err);
  }
};
