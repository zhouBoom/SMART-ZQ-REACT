export interface Message {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  timestamp: number;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  isSelf: boolean;
  status?: 'sending' | 'sent' | 'failed';
  avatar?: string;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
} 