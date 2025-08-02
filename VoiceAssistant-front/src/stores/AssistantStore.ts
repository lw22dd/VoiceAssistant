import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { Session, Message } from '@/model/SessionModel' // 更新导入
import SessionApi from '@/api/SessionApi'
import { Assistant } from '@/model/Assistant'
import AssistantApi from '@/api/AssistantApi'
import { LLMType } from '@/enums/LLMType'
import LLMApi from '@/api/LLMApi'
import { useRouter } from 'vue-router'

// 由于需求没有提及会话管理，也就是说一个助手只对应一个会话，
// 所以这里只需要一个selectedAssistantId即可

export const useAssistantStore = defineStore('assistant', () => {
  const sessions = ref<Session[]>([])

  const selectedAssistantId = ref<string>("")
  const router = useRouter();

  const currentSession = ref<Session | null>(null);
  const currentAssistant = ref<Assistant | null>(null);

  // 监听 selectedAssistantId 变化
  watch(selectedAssistantId, async (newVal, oldVal) => {
    if (newVal === oldVal) return
    currentAssistant.value = assistants.value.find(a => a.id === newVal) || null;
    currentSession.value = await getAssistantSession(newVal);

    router.push({
      path: '/',
      query: { assistantId: selectedAssistantId.value }
    })
  }, { immediate: false });


  // 助手列表
  const assistants = ref<Assistant[]>([])
  // 是否正在加载
  const isLoading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)


  // 初始化加载助手列表
  const initializeAssistants = async () => {
    try {
      isLoading.value = true
      console.log('AssistantApi getAll')

      const result = await AssistantApi.getAll()
      console.log('AssistantApi getAll', result)
      if (result.code === 200) {
        assistants.value = result.data || []
        // 默认选中第一个助手
        if (assistants.value.length > 0) {
          selectAssistant(assistants.value[0].id)
          return assistants.value[0].id
        }
      } else {
        error.value = result.msg || '加载助手列表失败'
      }
    } catch (err) {
      error.value = '网络请求失败'
      console.error('加载助手列表失败:', err)
    } finally {
      isLoading.value = false
    }
  }




  // 添加助手
  const addAssistant = async (assistant: Assistant) => {
    try {
      isLoading.value = true

      const result = await AssistantApi.create(assistant)
      if (result.code === 200 && result.data) {
        const newAssistant = result.data as Assistant;
        assistants.value.push(newAssistant);
        selectedAssistantId.value = newAssistant.id;

        // 创建会话并获取欢迎消息
        await createSessionWithInitialMessage(newAssistant.id);


        console.log('添加助手结果:', result)
        return result;
      } else {
        error.value = result.msg || '添加助手失败'
      }
      return result
    } catch (err) {
      error.value = '添加助手失败'
      console.error('添加助手失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  const createSessionWithInitialMessage = async (assistantId: string): Promise<Session | null> => {
    try {
      // 1. 创建会话
      const sessionResult = await SessionApi.createSession(assistantId);
      if (sessionResult.code !== 200 || !sessionResult.data) {
        throw new Error('创建会话失败');
      }
      const newSession = sessionResult.data;

      // 2. 添加初始欢迎消息
      const welcomeMessage: Message = {
        session_id: newSession.session_id,
        role: "assistant",
        content: `您好，我是您的智能助手，id_${assistantId}，请问有什么可以帮您？`,
        type: 'text',
        id: 0,
        timestamp: new Date()
      };

      // 3. 追加消息并获取更新后的会话
      const updatedSession = await appendMeg(newSession.session_id, welcomeMessage);

      // 4. 更新本地会话列表
      if (updatedSession) {
        sessions.value.push(updatedSession);
        return updatedSession;
      }



      return null
    } catch (err) {
      console.error('初始化会话失败:', err)
      return null
    }
  }
  const appendMeg = async (sessionId: string, message: Message, isSteream = false) => {
    try {

      const res = await SessionApi.appendMessage(sessionId, message);
      console.log('添加消息结果', res.data)
      // 直接更新本地会话（不重新拉取）
      currentSession.value?.context.push(message);
      return currentSession.value;
    } catch (error) {
      console.error(error)
    }
  };
  // 在useAssistantStore中添加以下方法
  const chat = async (assistant: Assistant, messages: Message[], stream = false) => {
    try {
      isLoading.value = true;
      const result = await LLMApi.sendChatRequest(assistant, messages, stream);
      return result;
    } catch (error) {
      console.error('LLM聊天请求失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  // 更新助手
  const updateAssistant = async (id: string, assistant: Assistant) => {
    try {
      isLoading.value = true
      const result = await AssistantApi.update(id, assistant)
      if (result.code === 200) {
        const index = assistants.value.findIndex(a => a.id === id)
        if (index !== -1) {
          assistants.value[index] = result.data as Assistant
        }
      } else {
        error.value = result.msg || '更新助手失败'
      }
      return result
    } catch (err) {
      error.value = '更新助手失败'
      console.error('更新助手失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 删除助手
  const deleteAssistant = async (id: string) => {
    try {
      isLoading.value = true
      const result = await AssistantApi.delete(id)
      if (result.code === 200) {
        assistants.value = assistants.value.filter(a => a.id !== id)
      } else {
        error.value = result.msg || '删除助手失败'
      }
      return result
    } catch (err) {
      error.value = '删除助手失败'
      console.error('删除助手失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 设置当前选中的助手
  const selectAssistant = (id: string) => {
    selectedAssistantId.value = id
    console.log('selectAssistant:', selectedAssistantId.value)

  }

  // 获取当前助手的会话历史
  const getAssistantSession = async (assistantId: string): Promise<Session | null> => {
    try {
      // 1. 先尝试从本地store查找已有会话
      const existingSession = sessions.value.find(s => s.assistant_id === assistantId)
      if (existingSession) {
        return existingSession
      }

      const result = await SessionApi.getSessionByAssistantId(assistantId)


      if (result.code === 200 && result.data) {
        sessions.value.push(result.data)
        return result.data
      }

      return null

    } catch (error) {
      console.error('获取助手会话失败:', error)
      return null
    }
  }



  /**
   * 删除助手的会话
   * @param assistantId 助手ID
   * @returns 是否删除成功
   */
  const deleteAssistantSession = async (assistantId: string): Promise<boolean> => {
    try {
      const session = await getAssistantSession(assistantId)
      if (!session) return true // 没有会话视为删除成功

      const result = await SessionApi.deleteAllSessionsByAssistantId(assistantId)
      if (result.code === 200) {
        sessions.value = sessions.value.filter(s => s.assistant_id !== assistantId)
        return true
      }
      error.value = result.msg || '删除会话失败'
      return false
    } catch (err) {
      error.value = '删除会话失败'
      console.error('删除会话失败:', err)
      return false
    }
  }



  // 重置会话
  const resetSession = async () => {
    if (!selectedAssistantId.value) {
      console.error("未选中任何助手");
      return false;
    }

    try {
      // 1. 删除旧会话（如果存在）
      if (currentSession.value) {
        const deleteResult = await SessionApi.deleteSession(currentSession.value.session_id);
        if (deleteResult.code !== 200) {
          console.error("【resetSession】删除旧会话失败:", deleteResult.msg);
          return false;
        }
        sessions.value = sessions.value.filter(
          s => s.session_id !== currentSession.value?.session_id
        );
      }

      // 2. 创建新会话（自动包含欢迎消息）
      const newSession = await createSessionWithInitialMessage(selectedAssistantId.value);
      if (!newSession) return false;

      // 3. 更新当前会话（触发响应式更新）
      currentSession.value = newSession;
      console.log("重置成功");
      return true;

    } catch (error) {
      console.error("异常:", error);
      return false;
    }
  };
  // 添加流式消息状态
  const streamingMessages = ref<Record<string, Message>>({}); // session_id -> 临时消息

  // 更新流式消息
  const updateStreamMessage = (sessionId: string, content: string, isFinal: boolean = false) => {
    if (!streamingMessages.value[sessionId]) {
      // 创建新的临时消息
      streamingMessages.value[sessionId] = {
        id: -1,
        session_id: sessionId,
        role: 'assistant',
        content: content,
        type: 'text',
        timestamp: new Date()
      };
    } else {
      // 更新现有临时消息
      streamingMessages.value[sessionId].content = content;
      streamingMessages.value[sessionId].timestamp = new Date();
    }

    // 如果是最终消息，移动到正式会话并清除临时消息
    if (isFinal) {
      if (currentSession.value?.session_id === sessionId) {
        const finalMessage = { ...streamingMessages.value[sessionId] };
        delete streamingMessages.value[sessionId];

        // 添加到正式会话（不触发重新拉取）
        //currentSession.value.context.push(finalMessage);
        appendMeg(sessionId, finalMessage, true)

      }
    }
  };

  // 获取当前显示的完整消息列表（包含临时流式消息）
  const getDisplayMessages = computed(() => {
    if (!currentSession.value) return [];

    const regularMessages = [...currentSession.value.context];
    const streamMessage = streamingMessages.value[currentSession.value.session_id];

    if (streamMessage) {
      return [...regularMessages, streamMessage];
    }
    return regularMessages;
  });



  return {
    initializeAssistants,
    isLoading,
    error,
    sessions,   // 
    currentSession,
    getAssistantSession,
    deleteAssistantSession,
    createSessionWithInitialMessage,
    appendMeg,
    chat,
    updateStreamMessage,
    getDisplayMessages,

    assistants,     // 所有助手列表
    selectAssistant, // 设置当前选中的助手
    selectedAssistantId,
    currentAssistant, // 获取选中助手实例
    addAssistant,
    updateAssistant,
    deleteAssistant,
    resetSession,

  }
})