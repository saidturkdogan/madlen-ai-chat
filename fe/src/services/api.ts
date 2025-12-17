import { AIModel, ChatSession, ChatResponse, Message } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Rate limit info interface
export interface RateLimitInfo {
  requests_remaining: number | null;
  requests_limit: number | null;
  requests_reset: string | null;
}

// Helper to get headers with Auth token
const getHeaders = async (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchModels = async (): Promise<AIModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`, { cache: 'no-store' }); // Ensure fresh fetch
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
  } catch (error) {
    console.error("Fetch models error:", error);
    return [];
  }
};

// Fetch rate limit info
export const fetchRateLimitInfo = async (): Promise<RateLimitInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rate-limit`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch rate limit');
    return await response.json();
  } catch (error) {
    console.error("Fetch rate limit error:", error);
    return { requests_remaining: null, requests_limit: null, requests_reset: null };
  }
};

export const fetchSessions = async (token: string): Promise<ChatSession[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      headers: await getHeaders(token)
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return await response.json();
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return [];
  }
};

export const createSession = async (token: string): Promise<ChatSession> => {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: await getHeaders(token)
  });
  if (!response.ok) throw new Error('Failed to create session');
  return await response.json();
};

export const deleteSession = async (sessionId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: await getHeaders(token)
  });
  if (!response.ok) throw new Error('Failed to delete session');
};

export const fetchSessionMessages = async (sessionId: string, token: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
    headers: await getHeaders(token)
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return await response.json();
}

export const sendMessage = async (
  sessionId: string,
  content: string,
  modelId: string,
  token: string,
  image?: File
): Promise<ChatResponse> => {

  // Convert image to base64 if provided
  let imageBase64: string | null = null;
  if (image) {
    imageBase64 = await fileToBase64(image);
  }

  const payload = {
    message: content,
    model: modelId,
    image: imageBase64
  };

  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/chat`, {
    method: 'POST',
    headers: await getHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Try to parse error detail from backend
    let errorMessage = 'Failed to send message';
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // If response is not JSON, use status text
      if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (response.status === 404) {
        errorMessage = 'Model not found. Please select a different model.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request. Please try again.';
      }
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

// Streaming message support
export const sendMessageStream = async (
  sessionId: string,
  content: string,
  modelId: string,
  token: string,
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  image?: File
): Promise<void> => {

  let imageBase64: string | null = null;
  if (image) {
    imageBase64 = await fileToBase64(image);
  }

  const payload = {
    message: content,
    model: modelId,
    image: imageBase64
  };

  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/chat/stream`, {
      method: 'POST',
      headers: await getHeaders(token),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.content) {
              onChunk(data.content);
            }
            if (data.done) {
              onComplete();
              return;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error');
  }
};

// Export chat history
export const exportChatHistory = async (
  sessionId: string,
  token: string,
  format: 'json' | 'txt' = 'json'
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/export?format=${format}`,
    {
      headers: await getHeaders(token)
    }
  );

  if (!response.ok) throw new Error('Failed to export chat');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-${sessionId.slice(0, 8)}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Return the full data URL (includes mime type prefix)
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
};