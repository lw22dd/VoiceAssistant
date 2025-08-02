import { LLMType } from "@/enums/LLMType";
import { Message } from "./SessionModel";

// 聊天接口请求结构，当调用/llm/chat时需要传入ChatRequest，获取ChatResponse，先用非流式测试
export interface ChatRequest {
    model: LLMType; // 必填字段，聊天模型
    messages: Message[]; // 必填字段，消息数组，至少包含一个元素
    stream?: boolean; // 可选字段，是否流式返回
    assistantId?: string; // 可选字段，助手ID
    temperature?: number; // 可选字段，温度参数
    maxTokens?: number; // 可选字段，最大生成token数
    userId?: string; // 可选字段，用户ID
    sessionId?: string; // 可选字段，会话ID
    lang?: string; // 可选字段，语言
    metadata?: Record<string, any>; // 可选字段，元数据
    prompt?: string; // 可选字段，提示词
  }
  
  
  // ChatResponse 聊天接口响应结构
export interface ChatResponse {
    id: string; // 响应ID
    model: LLMType; // 使用的模型
    created: number; // 创建时间戳
    choices: Choice[]; // 回复选项数组
    usage: TokenUsage; // token使用情况
    timestamp?: string; // 可选字段，时间戳
    userId?: string; // 可选字段，用户ID
    sessionId?: string; // 可选字段，会话ID
    lang?: string; // 可选字段，语言
    metadata?: Record<string, any>; // 可选字段，元数据
  }
  


  // Choice 回复选项
  interface Choice {
    index: number; // 选项索引
    message: Message; // 消息内容
    finishReason: string; // 结束原因
  }
  
  // TokenUsage token使用情况
  interface TokenUsage {
    promptTokens: number; // 提示词使用的token数
    completionTokens: number; // 生成内容使用的token数
    totalTokens: number; // 总共使用的token数
  }


