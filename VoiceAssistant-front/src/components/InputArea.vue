<template>
  <div class="bg-white border-t p-4">
    <div class="flex gap-6 items-center justify-center">
      <button class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
        :class="isCalling ? 'bg-red-500 animate-pulse' : 'bg-green-500'" @click="toggleCall">
        <div v-if="isCalling">
          <lucide-phone-off class="text-white" :size="32" />  
        </div>
        <div v-else>
          <LucidePhone class="text-white" :size="32" />
        </div>
      </button>

      <button
        class="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition  duration-300 hover:bg-gray-400"
        @click="openDialPad">
        <LucideKeyboard class="text-black" :size="32" />
      </button>

      <button class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
        :class="isRecording ? 'bg-blue-500' : 'bg-red-500'" @click="toggleRecording" v-if="isCalling">
        <LucideMic :class="isRecording ? 'text-white animate-pulse' : 'text-gray-200'" :size="32" />
      </button>
    </div>

    <!--拨号弹窗-->
    <DialPad v-if="showDialPad" @close="showDialPad = false" />

    <!-- 文字输入框 -->
    <div class="mt-4 flex gap-2">
      <input type="text" v-model="inputText" placeholder="输入文字测试对话..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="sendText">
      <button class="px-6 py-2 bg-blue-500 text-white rounded-full  hover:scale-105 transition"
        @click="sendText" :disabled="!inputText.trim()">
        发送
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { LucideMic, LucidePhoneOff, LucidePhone, LucideKeyboard } from 'lucide-vue-next';
import DialPad from './DialPad.vue';
import { useWebRTCStore } from '@/stores/WebRtcStore';
import { useInputAreaStore } from '@/stores/InputAreaStore';

const webRTCStore = useWebRTCStore();
const inputAreaStore = useInputAreaStore();

const inputText = ref('');
const showDialPad = ref(false);

const isCalling = computed(() => inputAreaStore.isCalling);
const isRecording = computed(() => inputAreaStore.isRecording);
const callDuration = computed(() => inputAreaStore.callDuration);

const emit = defineEmits(['send-text', 'reset']);

const toggleCall = async () => {
  if (inputAreaStore.isCalling) {
    endCall();
  } else {
    const success = await webRTCStore.startCall();
    if (success) {
      inputAreaStore.startCallTimer();
    }
  }
};

const endCall = () => {
  webRTCStore.endCall();
  inputAreaStore.isCalling = false;
  inputAreaStore.isRecording = false;
  inputAreaStore.resetCallTimer();
};

const openDialPad = () => {
  showDialPad.value = true;
};

const toggleRecording = () => {
  inputAreaStore.toggleRecordingStatus();
  if (inputAreaStore.isRecording) {
    webRTCStore.enableMicrophone();
  } else {
    webRTCStore.disableMicrophone();
  }
};

const sendText = () => {
  if (inputText.value.trim()) {
    emit('send-text', inputText.value.trim());
    inputText.value = '';
  }
};
</script>