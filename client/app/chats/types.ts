export type Message = {
    role: 'user' | 'assistant';
    content: string;
  };
  
  export type Character = {
    id: string;
    name: string;
    role: string;
    avatar: string;
    prompt: string;
  };
  