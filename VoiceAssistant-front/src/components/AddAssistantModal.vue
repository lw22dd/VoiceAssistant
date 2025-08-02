<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-1/3 max-w-xl">
      <form @submit.prevent="handleSubmit">
        <h3 class="text-xl font-bold mb-4">新增助手</h3>

        <!-- 名称 -->
        <div class="mb-4">
          <label class="block mb-1">名称 <span class="text-red-500">*</span></label>
          <input v-model="form.name" class="w-full border p-2 rounded" :class="{ 'border-red-500': errors.name }"
            placeholder="请输入名称">
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- 模型 -->
        <div class="mb-4">
          <label class="block mb-1">模型 <span class="text-red-500">*</span></label>
          <select v-model="form.model" class="w-full border p-2 rounded" :class="{ 'border-red-500': errors.model }">
            <option value="">请选择模型</option>
            <option :value="LLMType.QWEN_TURBO">Qwen Turbo</option>
            <option :value="LLMType.QWEN_PLUS">Qwen Plus</option>
          </select>
          <p v-if="errors.model" class="text-red-500 text-sm mt-1">{{ errors.model }}</p>
        </div>

        <!-- Prompt -->
        <div class="mb-4">
          <label class="block mb-1">描述 <span class="text-red-500">*</span></label>
          <textarea v-model="form.description" rows="3" class="w-full border p-2 rounded"
            placeholder="请输入描述"></textarea>
        </div>

        <div class="mb-4">
          <label class="block mb-1">提示词 <span class="text-red-500">*</span></label>
          <textarea v-model="form.prompt" rows="3" class="w-full border p-2 rounded" placeholder="请输入提示词"></textarea>
        </div>

        <!-- 语音设置 -->
        <div class="mb-4">
          <label class="block mb-2">语音设置</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1">语速</label>
              <input v-model.number="form.voice_style.speed" type="number" min="0.5" max="2" step="0.1"
                class="w-full border p-2 rounded">
            </div>
            <div>
              <label class="block text-sm mb-1">音调</label>
              <input v-model.number="form.voice_style.pitch" type="number" min="0.5" max="2" step="0.1"
                class="w-full border p-2 rounded">
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border rounded hover:bg-gray-50" @click="handleCancel">
            取消
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '确定' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Assistant } from '@/model/Assistant';
import { LLMType } from '@/enums/LLMType'

const emit = defineEmits(['close', 'submit']);
const isSubmitting = ref(false);



// 使用枚举值初始化表单
const form = reactive({
  name: '',
  model: LLMType.QWEN_TURBO, // 使用枚举默认值
  description: '',
  prompt: '',
  voice_style: {
    speed: 1,
    pitch: 1,
    volume: 1,
    emotion: 'neutral',
    temperature: 0.7
  }
});

const errors = reactive({
  name: '',
  model: ''
});

const validate = () => {
  let isValid = true;
  errors.name = '';
  errors.model = '';

  if (!form.name.trim()) {
    errors.name = '请输入助手名称';
    isValid = false;
  }
  if (!form.model) {
    errors.model = '请选择模型';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    emit('submit', { ...form });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('close');
};
</script>