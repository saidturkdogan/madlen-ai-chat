export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageUrl?: string; // For multi-modal bonus feature
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  isFree: boolean;
  contextWindow: number;
}

// Response expected from FastAPI (MessageResponse directly)
export interface ChatResponse {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  image_url?: string;
  model?: string;
}