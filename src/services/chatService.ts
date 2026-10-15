import { apiClient, USE_MOCK } from './api';
import { getMockChatReply } from '../mocks/mockChat';

export interface ChatResponsePayload {
  session_id: number;
  reply_tamil: string;
  reply_translit: string;
  reply_english: string;
  suggested_replies: string[];
}

export const chatService = {
  async sendMessage(
    message: string,
    topic: string = 'General Conversation',
    sessionId?: number
  ): Promise<ChatResponsePayload> {
    if (USE_MOCK) {
      // Simulate quick natural pause
      await new Promise((r) => setTimeout(r, 400));
      const mockResult = getMockChatReply(message, topic.toLowerCase());
      return {
        session_id: sessionId || 101,
        reply_tamil: mockResult.reply_tamil,
        reply_translit: mockResult.reply_translit,
        reply_english: mockResult.reply_english,
        suggested_replies: mockResult.suggested_replies,
      };
    }

    try {
      const response = await apiClient.post('/chat', {
        message,
        topic,
        session_id: sessionId,
      });
      return response.data;
    } catch (err) {
      console.warn('Backend chat failed, falling back to mock Kili reply');
      const mockResult = getMockChatReply(message, topic.toLowerCase());
      return {
        session_id: sessionId || 101,
        reply_tamil: mockResult.reply_tamil,
        reply_translit: mockResult.reply_translit,
        reply_english: mockResult.reply_english,
        suggested_replies: mockResult.suggested_replies,
      };
    }
  },
};
