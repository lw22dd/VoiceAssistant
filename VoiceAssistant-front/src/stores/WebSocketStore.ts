import { defineStore } from 'pinia';
import { ref } from 'vue';
import WebSocketClient from '@/utils/WebSocketClient';
import { WebSocketMessage } from '@/model/WebSocketMessageModel';
import { WebSocketMessageType } from '@/enums/WebSocketMessageType';
import { useWebRTCStore } from './WebRtcStore';
import { Message } from '@/model/SessionModel';
import { useAssistantStore } from './AssistantStore';

export const useWebSocketStore = defineStore('webSocket', () => {
    const assistantStore = useAssistantStore();

    // 定义状态
    const client = ref<WebSocketClient | null>(null);
    const isConnected = ref<boolean>(false);
    const heartbeatInterval = ref<any>(null);
    const llmStreamBuffer = ref<string>('');

    // 初始化 WebSocket
    const initializeWebSocket = () => {
        if (client.value) return;
        client.value = new WebSocketClient(handleMessage, import.meta.env.VITE_WEB_SOCKET_URL);
        connect();
    };

    // 连接 WebSocket
    const connect = async () => {
        if (!client.value) return;

        try {
            await client.value.connect();
            isConnected.value = true;
            startHeartbeat();
        } catch (error) {
            console.error('WebSocket 连接失败:', error);
        }
    };

    // 断开 WebSocket 连接
    const disconnect = () => {
        if (client.value) {
            client.value.disconnect();
            isConnected.value = false;
            stopHeartbeat();
        }
    };

    // 发送消息
    const sendMessage = (message: any) => {
        if (client.value) {
            const success = client.value.send(message);
            if (!success) {
                console.error('消息发送失败');
            }
        }
    };

    // 处理接收到的消息
    const handleMessage = (msg: WebSocketMessage) => {
        const webRTCStore = useWebRTCStore();
        if(msg.type!== WebSocketMessageType.heartbeat)
        console.log('收到消息:', msg);

        switch (msg.type) {
            case WebSocketMessageType.answer:
                console.log('收到 answer 消息:', msg);
                if (msg.data.answer) {
                    webRTCStore.handleAnswer(msg.data.answer);
                }
                break;

            case WebSocketMessageType.candidate:
                webRTCStore.handleCandidate(msg.data);
                break;

            case WebSocketMessageType.heartbeat:
                //console.log('收到心跳 Ping');
                break;

            case WebSocketMessageType.asr:
                // console.log('收到 asr 消息:', msg);
                // handleASR(msg.data);
                break;

            case WebSocketMessageType.llm_reply://非流式
                console.log('收到 llm_reply 消息:', msg);
                handleLLMReply(msg.data);
                break;
            case WebSocketMessageType.llm_reply_stream://流式
                //console.log('收到 llm_reply_stream 消息:', msg.data.llm_reply);
                handleLLMReplyStream(msg.data);
                break;
            default:
                console.log('未知消息类型:', msg.type);
                console.log('消息内容:', msg);
                break;
        }
    };

    // 开始心跳
    const startHeartbeat = () => {
        if (heartbeatInterval.value) return;

        heartbeatInterval.value = setInterval(() => {
            if (client.value?.getStatus() === 'OPEN') {
                const message: WebSocketMessage = { id: '0', type: WebSocketMessageType.Pong, data: "Pong" };
                // console.log('发送心跳 Pong');
                // client.value.send(message);
            } else {
                console.warn('WebSocket 未连接，无法发送心跳');
            }
        }, 3000);
    };

    // 处理 ASR 消息（用户语音转文字）
    const handleASR = async (asr: string) => {
        console.log('ASR 转文字:', asr);
        if (asr && assistantStore.currentSession) {
            const userMessage: Message = {
                session_id: assistantStore.currentSession!.session_id,
                role: 'user',
                content: asr,
                type: 'text',
                id: 0,
                timestamp: new Date()
            };
            const data = assistantStore.appendMeg(assistantStore.currentSession.session_id, userMessage);
            // 刷新 UI
            // assistantStore.refreshSession();
            if (await data) {
                return true;

            }
        }

    };
   const handleLLMReplyStream = (data: {
  final_reply: string;
  llm_reply: string,
  asr_text: string,
  stream?: boolean,
  is_final?: boolean
}) => {
  if (!assistantStore.currentSession) return;
  
  const sessionId = assistantStore.currentSession.session_id;
  
  // 处理ASR文本
  if (data.asr_text) {
    handleASR(data.asr_text);
  }

  // 流式处理逻辑
  if (data.stream) {
    // 累积流式回复内容
    llmStreamBuffer.value += data.llm_reply;
    
    // 更新前端显示的流式消息appendMeg 
    assistantStore.updateStreamMessage(
      sessionId,
      llmStreamBuffer.value,
      data.is_final
    );

    // 如果是最终块，重置缓冲区
    if (data.is_final) {
      llmStreamBuffer.value = '';
    }
  }
};
    // 处理 LLM 回复
    const handleLLMReply = (data: { llm_reply: string, asr_text: string }) => {
        if (data.llm_reply && assistantStore.currentSession) {
            const aiMessage: Message = {
                session_id: assistantStore.currentSession.session_id,
                role: 'assistant',
                content: data.llm_reply,
                type: 'text',
                id: 0,
                timestamp: new Date()
            };
            // 先存用户消息再存 AI 回复
            handleASR(data.asr_text).then((res) => {
                if (assistantStore.currentSession && res)
                    assistantStore.appendMeg(assistantStore.currentSession.session_id, aiMessage);
            });

            // 刷新 UI
            // assistantStore.refreshSession();
        }
    };

    // 停止心跳
    const stopHeartbeat = () => {
        if (heartbeatInterval.value) {
            clearInterval(heartbeatInterval.value);
            heartbeatInterval.value = null;
        }
    };

    return {
        client,
        isConnected,
        heartbeatInterval,
        initializeWebSocket,
        connect,
        disconnect,
        sendMessage,
        handleMessage,
        startHeartbeat,
        handleASR,
        handleLLMReply,
        stopHeartbeat
    };
});