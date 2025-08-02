<template>
 <div class="flex flex-col min-h-screen bg-gray-50">
    <!--Header-->
    <header class="bg-white p-4 border-b shadow-sm">
     <div class="container mx-auto">
      <h1 class="text-xl font-bold text-gray-800">{{ assistant?.name }}</h1>
      <p class="text-sm text-gray-600 mt-1">
        {{ assistant?.description || '无描述信息' }}
      </p>
     </div>
    </header>

    <main class="flex flex-1 container mx-auto">
      <div v-if="loading" class="text-center py-10">
       <span class="text-gray-500">加载中...</span>
      </div>
    
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded p-4 mb-4">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!--Left-->
      <div v-else-if="assistant" class="bg-gray-50 rounded-lg shadow p-3 mt-4 ml-2 mr-4 w-1/2 flex flex-col">

        <div class="flex-2 p-4 bg-white rounded-lg shadow mb-6">
           <div class="flex justify-between items-start mb-6 border-b ">
            <h3 class="text-lg font-semibold text-gray-500">提示词</h3>
            <div class="flex gap-4">
              <button class="text-gray-500" @click="toggleEdit">
                <div class="flex gap-1 items-center">
                   <LucidePencil class="hover:scale-110 transition mr-1" :size="25"/>
                   <p class="hover:text-blue-300 transition">{{ isEditable ? '完成' : '编辑' }}</p> 
                </div>
              </button>
              <button class="text-blue-500" @click="goBack">
                <div class="items-center flex gap-1">
                   <LucideUndo2 class="hover:text-blue-700 transition" :size="25"/>
                   <p>返回</p>
                </div>
              </button>
            </div>
           </div>

           <textarea 
            v-if="isEditable"
            v-model="assistant.prompt"
            class="w-full h-80 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="请输入机器人系统提示词">
            </textarea>
           <div v-else class="whitespace-pre-wrap text-gray-700 text-sm">
             {{ assistant.prompt || '暂无提示词' }}
           </div>
        </div>
       
        <div class=" flex-3 p-4 bg-white rounded-lg shadow " >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-700">企业知识库</h3>
            <button class="text-blue-500 hover:text-blue-700 border border-blue-500 px-3 py-1 rounded 
                     flex items-center">
              绑定知识库
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(kb, idx) in knowledgeBases"
              :key="idx"
              class="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <span class="text-gray-700 text-sm">{{ kb.name }}</span>
              <i class="fa fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        </div>

      </div>
    
      <div v-else class="text-center py-10">
        <p class="text-gray-500">未找到助手信息</p>
        <button 
          class="mt-4 text-blue-500 hover:text-blue-700"
          @click="goBack"
        >
          <i class="fa fa-arrow-left mr-1"></i>返回助手列表
        </button>
      </div>

      <!-- 右侧对话测试区域 -->
      <section class="flex-1 flex flex-col border-l p-6">
        <!-- 顶部标题栏 -->
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-xl font-semibold">效果测试</h2>
          <button class="text-gray-500 hover:text-gray-700" @click="handleReset">
            <div class="flex gap-1 items-center">
              <LucideRotateCcw class="hover:scale-110" :size="18"/>
              <p>重置对话</p>
            </div>
          </button>
        </div>

        <!-- 对话内容区 -->
        <div class="flex-1 bg-gray-50 p-4 overflow-hidden" style="max-height: calc(100vh - 200px);">
          <div class="h-full overflow-y-auto chat-scroll-container" ref="chatContainer">
            <div class="space-y-4 max-w-3xl mx-auto">
              <div 
                v-for="(message, index) in chatMessages" 
                :key="index"
                class="flex items-start gap-3"
                :class="message.sender === 'user' ? 'justify-end' : ''"
              >
                <!-- AI头像 -->
                <div v-if="message.sender === 'ai'" class="w-8 h-8 rounded-full bg-purple-400 
                          flex items-center justify-center flex-shrink-0">
                  <p class="text-white text-xs">AI</p>
                </div>

                <!-- 消息内容 -->
                <div 
                  :class="message.sender === 'ai' 
                    ? 'bg-white p-3 rounded-lg shadow-sm max-w-[65%] text-gray-700' 
                    : 'bg-blue-500 text-white p-3 rounded-lg shadow-sm max-w-[65%]'"
                >
                  <p class="text-sm">{{ message.content }}</p>
                </div>

                <!-- 用户头像 -->
                <div v-if="message.sender === 'user'" class="w-8 h-8 rounded-full bg-gray-300 
                          flex items-center justify-center flex-shrink-0">
                  <p class="text-gray-700 text-xs">我</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="mt-4 flex gap-2">
          <input 
            v-model="inputText" 
            type="text" 
            placeholder="请输入您想问的问题"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            @keyup.enter="sendTextMessage"
          />
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded-full hover:scale-110
                   transition"
            @click="sendTextMessage"
            :disabled="!inputText.trim() || isSending"
          >
            <span v-if="isSending">发送中...</span>
            <span v-else>发送</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Assistant } from '@/model/Assistant';
import AssistantApi from '@/api/AssistantApi';
import { LucidePencil, LucideUndo2, LucideRotateCcw } from 'lucide-vue-next';
import LLMApi from '@/api/LLMApi';
import { Message as LLMMessage } from '@/model/SessionModel';
import { LLMType } from '@/enums/LLMType';

const route = useRoute();
const router = useRouter();
const assistant = ref<Assistant | null>(null);
const loading = ref(true);
const error = ref('');

// 助手设置相关
const isEditable = ref(false);
const toggleEdit = () => {
  isEditable.value = !isEditable.value;
  
  // 保存修改
  if (!isEditable.value && assistant.value) {
    saveAssistantChanges();
  }
};

// 聊天相关状态
const chatMessages = ref([
  {
    sender: 'ai',
    content: ''
  }
]);
const inputText = ref('');
const chatContainer = ref<HTMLElement | null>(null);
const isSending = ref(false);

// 知识库模拟数据
const knowledgeBases = ref([
  { name: 'xx体验机器人知识' },
  { name: 'xx机器人对接' }
]);

// 保存助手修改
const saveAssistantChanges = async () => {
  if (!assistant.value) return;
  
  try {
    loading.value = true;
    const result = await AssistantApi.update(assistant.value.id, assistant.value);
    console.log('更新助手成功:', result.data);
    if (result.code !== 200) {
      console.error('更新助手失败:', result.msg);
    }
  } catch (err) {
    console.error('更新助手失败:', err);
  } finally {
    loading.value = false;
  }
};

// 获取助手详情
const fetchAssistant = async (id: string) => {
  try {
    loading.value = true;
    const result = await AssistantApi.getById(id);
    console.log('获取助手详情成功:', result.data);
    if (result.data) {
      assistant.value = result.data;
      
      // 设置初始AI消息
      chatMessages.value = [
        {
          sender: 'ai',
          content: `您好，我是${assistant.value.name}，${assistant.value.description || '请问有什么可以帮您？'}`
        }
      ];
    } else {
      error.value = result.msg || '获取助手信息失败';
    }
  } catch (err) {
    error.value = '请求出错，请稍后重试';
    console.error('获取助手详情失败:', err);
  } finally {
    loading.value = false;
  }
};

// 发送消息
const sendTextMessage = async () => {
  const userMessage = inputText.value.trim();
  if (!userMessage || !assistant.value || isSending.value) return;

  try {
    isSending.value = true;
    
    // 添加用户消息
    const newUserMessage = {
      sender: 'user',
      content: userMessage
    };
    chatMessages.value.push(newUserMessage);
    inputText.value = '';
    scrollToBottom();
    
    // 准备LLM请求
    const llmMessages: LLMMessage[] = chatMessages.value.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
      // 以下字段为临时会话不需要，但为了类型兼容保留
      id: 0,
      session_id: '',
      type: 'text',
      timestamp: new Date()
    }));
    
    // 调用LLM API
    const result = await LLMApi.sendChatRequest(
      assistant.value,
      llmMessages,
      false
    );
    
    // 添加AI回复
    const aiContent = result.choices[0].message.content;
    chatMessages.value.push({
      sender: 'ai',
      content: aiContent
    });
    
    scrollToBottom();
  } catch (err) {
    console.error('发送消息失败:', err);
    chatMessages.value.push({
      sender: 'ai',
      content: '抱歉，我遇到了问题，请稍后再试。'
    });
    scrollToBottom();
  } finally {
    isSending.value = false;
  }
};

// 重置对话
const handleReset = () => {
  chatMessages.value = assistant.value 
    ? [{
        sender: 'ai',
        content: `您好，我是${assistant.value.name}，${assistant.value.description || '请问有什么可以帮您？'}`
      }]
    : [{
        sender: 'ai',
        content: '您好，我是您的智能助手，请问有什么可以帮您？'
      }];
  
  inputText.value = '';
  scrollToBottom();
};

// 返回助手列表
const goBack = () => {
  router.push('/');
};

// 滚动到对话底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }, 50);
};

onMounted(() => {
  const id = route.query.id as string;
  if (id) {
    fetchAssistant(id);
  } else {
    error.value = '缺少助手ID参数';
    loading.value = false;
  }
});
</script>

<style scoped>
label {
  @apply block text-sm font-medium text-gray-500 mb-1;
}

textarea {
  line-height: 1.6;
  font-size: 14px;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.hover:bg-gray-100 {
  background-color: #f3f4f6;
}

button svg {
  cursor: pointer;
}

.chat-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.chat-scroll-container::-webkit-scrollbar {
  width: 2px;
}

.chat-scroll-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 2px;
}

.chat-scroll-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.chat-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>