<!--这里是快捷输入 DialPad.vue -->
<template>
  <div 
    class="fixed inset-0 flex items-center justify-center bg-black/30 z-50" 
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <!-- 关闭按钮 -->
      <div class="flex justify-end mb-4">

        <button 
          class="text-gray-500 hover:text-gray-700" 
          @click="$emit('close')"
        >
          <LucideX class="h-6 w-6" />
        </button>
      </div>

      <!-- 输入框 -->
      <div class="text-center mb-4">
        <input 
         v-model="inputValue"
          type="text" 
          placeholder="请输入号码" 
          class="border border-gray-300 p-2 rounded w-full text-center"
        />
      </div>

      <!-- 拨号盘 -->
      <div class="grid grid-cols-3 gap-2 mx-3">

        <button 
          v-for="num in ['1','2','3','4','5','6','7','8','9','*','0','#']" 
          :key="num" 
          class="bg-gray-100 p-3  rounded-full w-16 h-16 hover:bg-gray-200 transition flex items-center justify-center"
          @click="handleNum(num)"
        >
        <span class="text-xl font-bold">{{ num }}</span>
        </button>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center gap-12 mt-4">
        <button 
          class="bg-green-500 text-white px-4 py-2 rounded-full w-16 h-16  hover:bg-green-600" 
         
        >
          <LucidePhone class="text-white":size="32"/>
        </button>
        <button 
          class="bg-red-500 text-white px-4 py-2 rounded-full w-16 h-16 hover:bg-red-600" 
    
        >
          <LucidePhoneOff class="text-white":size="32"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { LucideX } from 'lucide-vue-next';
import { ref } from 'vue';
import { LucidePhone,LucidePhoneOff } from 'lucide-vue-next';

const inputValue = ref('');
const emit = defineEmits(['close']);

const handleNum = (num:String)=>{
    inputValue.value += num;
}


//拨号逻辑
const handleCall =()=>{

}

//挂断逻辑
const handleHangUp =()=>{

}

</script>

