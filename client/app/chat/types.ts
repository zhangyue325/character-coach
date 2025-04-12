export type RolePlay = {
  id: string;
  title: string;
  description: string;
  character: string;
  avatar: string;
  prompt: string;
  cover: string;
  greet: string;
};

export type Message = {
  role: 'user' | 'assistant';
  type: 'text' | 'audio';
  text?: string,
  audioUri?: string,
  timestamp: number,
};