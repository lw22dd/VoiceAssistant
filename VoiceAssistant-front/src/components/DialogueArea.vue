<template>
  <div class="flex-1 bg-gray-200 p-4 overflow-hidden" style="max-height: calc(100vh - 400px);">
    <div class="h-full overflow-y-auto chat-scroll-container" ref="chatContainer">
      <div class="space-y-6 max-w-3xl mx-auto">
        <!-- 动态渲染对话消息 -->
        <div v-for="(message, index) in messages" :key="index"
          :class="message.sender === 'assistant' ? 'flex items-start gap-3' : 'flex items-start gap-3 justify-end'"
          class="animate__animated animate__fadeIn">
          
          <div v-if="message.sender === 'assistant'"
            class="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0">
            <p class="text-white">AI</p>
          </div>
          
          <div :class="message.sender === 'assistant'
            ? 'bg-white p-4 rounded-lg shadow-sm max-w-[65%]'
            : 'bg-blue-500 text-white p-4 rounded-lg shadow-sm max-w-[65%]'">
            <p>{{ message.content }}</p>
             <!-- 音波动画（仅AI新增消息显示） -->
            <div v-if="message.sender === 'assistant' && message.isNew" class="wave-container">
              <div class="wave" v-for="(bar, i) in 5" :key="i"></div>
            </div>

          </div>
          
          <div v-if="message.sender === 'user'"
            class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <p class="text-gray-700">我</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

const props = defineProps({
  messages: {
    type: Array as () => Array<{ sender: string; content: string ,isNew: boolean; }>,
    required: true,
    default: () => [],
    
  }
});

const chatContainer = ref<HTMLElement | null>(null);

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 监听消息变化自动滚动
watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });
</script>

<style scoped>

.wave-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 8px;
}

.wave {
  width: 2px;
  height: 10px;
  background: #6366f1;
  animation: waveLoop 1s infinite ease-in-out;
}

.wave:nth-child(2) { animation-delay: 0.2s; }
.wave:nth-child(3) { animation-delay: 0.4s; }
.wave:nth-child(4) { animation-delay: 0.6s; }
.wave:nth-child(5) { animation-delay: 0.8s; }

@keyframes waveLoop {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(3); }
  100% { transform: scaleY(1); }
}
</style>