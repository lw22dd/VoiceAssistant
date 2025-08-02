// LLMApi.ts 修改发送方法
import { LLMType } from '@/enums/LLMType';
import { Assistant } from '@/model/Assistant';
import { ChatRequest, ChatResponse } from '@/model/LLMModel';
import { Result } from '@/model/result';
import { Message } from '@/model/SessionModel';
import Fetch from '@/utils/Fetch';


export default class LLMApi {
    public static async sendChatRequest(assistant: Assistant, messages: Message[], stream = false
    ): Promise<ChatResponse> {
        const request: ChatRequest = {
            model: assistant.model as LLMType,
            messages,
            stream,
            assistantId: assistant.id.toString(),
            prompt: assistant.prompt,
        };
        console.log("LLM chat request", request);
        return await Fetch.post("/llm/chat", request);
    }
}