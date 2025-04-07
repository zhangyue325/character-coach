import { SERVER_URL } from '../../config';

export async function fetchCharacter(id: string) {
    const res = await fetch(`${SERVER_URL}/characters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch character');
    return await res.json();
  }