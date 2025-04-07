import type { Message } from './types';
import { SERVER_URL } from '../../config';

export const getMessages = async (id: string): Promise<Message[]> => {
  try {
    const res = await fetch(`${SERVER_URL}/history/${id}`);
    if (!res.ok) throw new Error('Failed to load history');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('getMessages error:', err);
    return [];
  }
};

export const saveMessages = async (id: string, messages: Message[]) => {
  try {
    await fetch(`${SERVER_URL}/history/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
  } catch (err) {
    console.error('saveMessages error:', err);
  }
};
