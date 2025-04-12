export type RolePlay = {
  id: string;
  title: string;
  description: string;
  character: string;
  avatar: string;
  prompt: string;
  cover: string;
  greet: string;
  greetaudio: string;
};

export type Message = {
  role: 'user' | 'assistant';
  type: 'text' | 'audio';
  content: string;
  audioUri?: string;
  timestamp: number;
};