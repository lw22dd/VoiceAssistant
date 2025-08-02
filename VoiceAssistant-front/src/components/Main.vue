<template>
  <section class=" flex flex-col ml-2" :class="layoutStore.isSidebarOpen ? 'w-3/4' : 'w-[calc(100%-4rem)]'">
    <!--header-->
    <div class="flex justify-between items-center bg-white border-b p-4">
      <h2 class="text-xl font-semibold">效果测试</h2>
      <div class="flex items-center gap-4">
        <span class="text-sm flex items-center" :class="inputAreaStore.isCalling ? 'text-green-600' : 'text-gray-500'">
          <span class="w-2 h-2 rounded-full mr-1" :class="inputAreaStore.isCalling ? 'bg-green-600' : 'bg-gray-300'"></span>
          {{ inputAreaStore.callStatusText }} {{ inputAreaStore.callDuration }}
        </span>

        <button class="text-gray-500 hover:text-gray-800" @click="handleReset">
          <div class="flex gap-1 items-center">
            <LucideRotateCcw class="hover:scale-110" :size="18" />
            <p>重置对话</p>
          </div>
        </button>

        <button class="p-2 rounded-full hover:bg-gray-100" @click="toggleTheme"  aria-label="切换主题">
          <LucideMoon v-if="isDarkMode" :size="20" />
          <LucideSun v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- 对话区域 -->
    <DialogueArea :messages="chatMessages" />
    
    <!-- 输入区域 -->
    <InputArea 
      @send-text="sendTextMessage" 
      @reset="handleReset"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { LucideRotateCcw, LucideMoon, LucideSun } from 'lucide-vue-next';
import { useAssistantStore } from '@/stores/AssistantStore';
import { useRoute } from 'vue-router';
import { useWebSocketStore } from '@/stores/WebSocketStore';
import DialogueArea from '@/components/DialogueArea.vue';
import InputArea from '@/components/InputArea.vue';
import { useLayoutStore } from '@/stores/LayoutStore';
import { Message } from '@/model/SessionModel';
import { useInputAreaStore } from '@/stores/InputAreaStore';


const lastLoadTime = ref<number>(0);
const layoutStore = useLayoutStore();
const webSocketStore = useWebSocketStore();
const route = useRoute();
const assistantStore = useAssistantStore();
const inputAreaStore = useInputAreaStore(); // 管理输入区域状态

// 替换原有的 chatMessages 计算属性
const chatMessages = ref<Array<{
  sender: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  isNew: boolean;
}>>([]);
/*
const chatMessages = computed(() => {
  return assistantStore.getDisplayMessages.map(msg => ({
    sender: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
    timestamp: msg.timestamp,
    isNew: false

  }));
});*/

const isDarkMode = ref(false);
const htmlElement = document.documentElement;
// 验证消息角色的类型守卫函数
function isRoleValid(role: string): role is 'user' | 'assistant' {
  return role === 'user' || role === 'assistant';
}

// 监听助手消息变化，为新增AI消息添加 isNew
watch(
  () => assistantStore.getDisplayMessages,
  (newMessages) => {
    const existingIds = chatMessages.value.map(msg => 
      `${msg.content}-${msg.timestamp.getTime()}`
    );

    // 修改：确保sender类型安全
    const updatedMessages = newMessages.map((newMsg) => {
      const newTimestamp = newMsg.timestamp instanceof Date 
        ? newMsg.timestamp 
        : new Date(newMsg.timestamp);
      const newId = `${newMsg.content}-${newTimestamp.getTime()}`;

      const oldMsg = chatMessages.value.find(old => 
        `${old.content}-${old.timestamp.getTime()}` === newId
      );

      // 关键修改：使用类型守卫确保role合法
      if (!isRoleValid(newMsg.role)) {
        console.error(`Invalid role: ${newMsg.role}`);
        return null; // 或处理非法角色的逻辑
      }

      const isNewMsg = !existingIds.includes(newId) 
        && newMsg.role === 'assistant' 
        && newTimestamp.getTime() > lastLoadTime.value;

      return {
        sender: newMsg.role, // 现在TypeScript知道role是'user'|'assistant'
        content: newMsg.content,
        timestamp: newTimestamp,
        isNew: oldMsg ? oldMsg.isNew : isNewMsg
      };
    }).filter((msg): msg is NonNullable<typeof msg> => msg !== null); // 过滤掉非法消息

    chatMessages.value = updatedMessages; // 类型错误已修复

    // 5秒后清除isNew状态
    updatedMessages.forEach(msg => {
      if (msg.isNew) {
        setTimeout(() => {
          const target = chatMessages.value.find(m => 
            m.content === msg.content && m.timestamp.getTime() === msg.timestamp.getTime()
          );
          if (target) target.isNew = false;
        }, 6000);
      }
    });
  },
  { immediate: true, deep: true }
);



// 初始化加载
onMounted(async () => {
  //webSocketStore.initializeWebSocket();
  loadSessionHistory();
  lastLoadTime.value = Date.now(); // 初始化后记录时间
  
  // 初始化主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    htmlElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    isDarkMode.value = false;
    htmlElement.classList.remove('dark');
  } else {
    // 默认跟随系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value = prefersDark;
    if (prefersDark) {
      htmlElement.classList.add('dark');
    }
  }
});

// 监听路由变化
watch(() => route.query.assistantId, async (newAssistantId) => {
  if (newAssistantId) {
    assistantStore.selectAssistant(newAssistantId as string);
    loadSessionHistory();
  }
}, { immediate: false });

const loadSessionHistory = async () => {
  const assistantId = assistantStore.selectedAssistantId || route.query.assistantId as string;
  if (!assistantId) return;
  
  // 直接从 store 获取最新会话
  const session = await assistantStore.getAssistantSession(assistantId);
  if (session) {
    assistantStore.currentSession = session;
    lastLoadTime.value = Date.now(); // 加载会话后更新时间
  }
};

// 发送消息
const sendTextMessage = async (text: string) => {
  if (!text || !assistantStore.currentSession) return;

  try {
    const userMessageObj: Message = {
      id: 0,
      session_id: assistantStore.currentSession.session_id,
      type: 'text',
      timestamp: new Date(),
      role: 'user',
      content: text
    };

    // 保存消息
    await assistantStore.appendMeg(
      assistantStore.currentSession.session_id,
      userMessageObj
    );

    // 获取助手配置
    const assistant = assistantStore.currentAssistant;
    if (!assistant) throw new Error('未选择助手');

    // 调用LLM API
    const result = await assistantStore.chat(
      assistant,
      assistantStore.currentSession.context,
      false
    );

    // 处理AI回复
    const aiContent = result.choices[0].message.content;
    const aiMessageObj: Message = {
      id: 0,
      session_id: assistantStore.currentSession.session_id,
      type: 'text',
      timestamp: new Date(),
      role: 'assistant',
      content: aiContent
    };

    // 保存AI回复
    await assistantStore.appendMeg(
      assistantStore.currentSession.session_id,
      aiMessageObj
    );
  } catch (error) {
    console.error('消息发送失败:', error);
  }
};

const handleReset = async () => {
  const success = await assistantStore.resetSession();
  if (success) {
    loadSessionHistory();
  }
};

// 切换主题的函数
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  
  if (isDarkMode.value) {
    htmlElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};
</script>


<style scoped>

/* Header 美化 */
.bg-white.border-b {
   border-bottom: none;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;

}

h2.text-xl {
  color: #2d3748;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: 0;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 对话区域美化 */
.bg-gray-200 {
  background-color: #f1f5f9;
  /* 添加背景纹理增强层次感 */
  background-image: 
    radial-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 1px),
    radial-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

/* 对话气泡优化 */
.bg-white.p-4.rounded-lg {
  border-radius: 18px 18px 18px 6px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 14px 18px;
  position: relative;
  animation: fadeIn 0.3s ease-out;
  transition: all 0.2s ease;
}

.bg-blue-500.text-white.p-4.rounded-lg {
 border-radius: 18px 18px 6px 18px;
  /* 添加浏览器前缀并增强渐变对比度 */
  background: linear-gradient(135deg, #4338ca, #6366f1);
  background: -webkit-linear-gradient(135deg, #4338ca, #6366f1);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  padding: 14px 18px;
  animation: fadeIn 0.3s ease-out;
  transition: all 0.2s ease;
}

/* 系统提示消息（如工具调用状态） */
.system-message {
  background: #f0f9ff;
  border-left: 4px solid #38bdf8;
  color: #0369a1;
  padding: 10px 16px;
  border-radius: 4px 12px 12px 4px;
  font-size: 0.9rem;
  max-width: 50%;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-out;
}

/* 消息出现动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 脉冲动画（用于通话状态） */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}

/* 气泡悬停动画 */
.bg-white.p-4.rounded-lg:hover,
.bg-blue-500.text-white.p-4.rounded-lg:hover {
  transform: translateY(-1px);
}


.w-16.h-16.rounded-full:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* 输入区域美化 */
.flex-1.px-4.py-2.border-t {
  border-top: none;
  background: white;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.03);
  padding: 16px;
}
.flex.gap-6.items-center.justify-center {
  gap: 20px;
  margin-bottom: 16px;
}

/* 通话按钮 */
.w-16.h-16.rounded-full {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 通话中按钮 */
.bg-red-500 {
  background: radial-gradient(circle at center, #ef4444, #dc2626);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

/* 空闲按钮 */
.bg-green-500 {
  background: radial-gradient(circle at center, #22c55e, #16a34a);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

/* 文字输入框 */
.flex-1.px-4.py-2.border {
  border-radius: 30px;
  padding: 12px 20px;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
}

.flex-1.px-4.py-2.border:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
}

/* 发送按钮 */
button.px-6.py-2.bg-blue-500 {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 30px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

button.px-6.py-2.bg-blue-500:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}


/* 重置按钮美化 */
.text-gray-500.hover\\:text-gray-800 {
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.text-gray-500.hover\\:text-gray-800:hover {
  background-color: #f3f4f6;
}

/* 滚动条美化 */
.chat-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.chat-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.chat-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.chat-scroll-container::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 10px;
}

.chat-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}
/* 深色模式样式 */
html.dark section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

html.dark .bg-white.border-b {
  background: #1e293b;
}

html.dark .bg-gray-200 {
  background: #0f172a;
}

html.dark .bg-white.p-4.rounded-lg {
  background: #1e293b;
  color: #f8fafc;
}

/* 音波容器 */
.wave-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 8px;
}


</style>  