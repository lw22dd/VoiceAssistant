// 会话消息结构
export interface Message {
    id: number
    session_id: string
    type: 'text' | 'voice' | 'status' | 'error'; 
    timestamp: Date
    role: 'user' | 'assistant' | 'system'; // 必填字段，角色必须是system、user或assistant之一
    content: string; // 必填字段，消息内容
  }
  
  // 会话结构
  export interface Session {
    session_id: string
    user_id: string
    assistant_id: string
    create_time: Date
    last_active: Date
    context: Message[]
  }
