// ... existing code ...
import type { Result } from "@/model/result";
import type { Session, Message } from "@/model/SessionModel"; // 更新导入
import Fetch from "@/utils/Fetch";


export default class SessionApi {
  public static async getSessionByAssistantId(assistantId: string): Promise<Result<Session>> {
    return await Fetch.get(`/session/assistant/${assistantId}`);
  }
  /**
   * 创建新会话
   * @param assistantId 助手ID
   * @returns 会话对象
   */
  public static async createSession(assistantId: string): Promise<Result<Session>> {
    console.log("createSession的assistantId", assistantId);
    return await Fetch.post("/session/create", {
      user_id: "1",
      assistant_id: `${assistantId}`
    });
  }

  // /**
  //  * 获取会话详情
  //  * @param sessionId 会话ID
  //  * @returns 会话详情
  //  */
  // public static async getSession(sessionId: string): Promise<Result<Session>> {
  //   return await Fetch.get(`/session/${sessionId}`);
  // }

  /**
   * 追加消息到会话
   * @param sessionId 会话ID
   * @param message 消息内容
   * @returns 更新后的会话，包括所有消息
   */
  public static async appendMessage(
    sessionId: string,
    message: {
      role: 'user' | 'assistant' | 'system';
      content: string;
      type: 'text' | 'voice' | 'status' | 'error'; 
    }
  ): Promise<Result<Session>> {
    return await Fetch.post(`/session/${sessionId}/context/appendMessage`, message);
  }

  // /**
  //  * 获取单条消息
  //  * @param sessionId 会话ID
  //  * @param messageId 消息ID
  //  * @returns 消息详情
  //  */
  // public static async getMessage(sessionId: string, messageId: number): Promise<Result<Message>> {
  //   return await Fetch.get(`/session/${sessionId}/get/${messageId}`);
  // }

  // /**
  //  * 更新消息内容
  //  * @param sessionId 会话ID
  //  * @param messageId 消息ID
  //  * @param content 新内容
  //  * @returns 操作结果
  //  */
  // public static async updateMessage(
  //   sessionId: string,
  //   messageId: number,
  //   content: string
  // ): Promise<Result<void>> {
  //   return await Fetch.post(`/session/${sessionId}/update/${messageId}`, {
  //     content
  //   });
  // }

  // /**
  //  * 删除指定消息
  //  * @param sessionId 会话ID
  //  * @param messageId 消息ID
  //  * @returns 操作结果
  //  */
  // public static async deleteMessage(
  //   sessionId: string,
  //   messageId: number
  // ): Promise<Result<void>> {
  //   return await Fetch.post(`/session/${sessionId}/delete/${messageId}`);
  // }

  /**
   * 删除所有会话
   * @returns 操作结果
   */
  public static async deleteAllSessionsByAssistantId(assistantId: string): Promise<Result<void>> {
    return await Fetch.post("/session/deleteAll", { confirm: true });
  }


  /**
   * 删除单个会话
   * @returns 操作结果
   */
  public static async deleteSession(sessionId: string): Promise<Result<void>> {
    return await Fetch.post(`/session/${sessionId}/delete`);
  }
}