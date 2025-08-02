
<template>
  <aside class=" bg-white border-r p-4 flex flex-col transition-all duration-300 ease-in-out"
  :class="layoutStore.isSidebarOpen ? 'w-1/4' : 'w-16'">

  <!--sideBar-->

    <button 
       @click="toggleSidebar"
      class="mb-6 p-2 rounded-full w-8 h-8 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
    >
      <LucidePanelLeftClose v-if="layoutStore.isSidebarOpen" :size="16" />
      <LucidePanelLeftOpen v-else :size="20" />
    </button>

    <button class="bg-blue-500 text-white  rounded mb-6 hover:bg-blue-600 flex items-center justify-center" @click="showAddModal = true"
    :class="layoutStore.isSidebarOpen ? 'px-4 py-2' : 'w-8 h-8'">
      <span class="text-center">+</span>
      <span v-if="layoutStore.isSidebarOpen" class="ml-2">新增助手</span> 
    </button>
<!-- 助手卡片列表 -->
  <div class="flex-1 space-y-4  pr-1 custom-scrollbar overflow-y-auto "
  v-if="layoutStore.isSidebarOpen"
   :style="{ maxHeight: 'calc(100vh - 200px)' }">
      <div v-for="(assistant, index) in assistantStore.assistants" 
     :key="index" @click="selectAssistant(assistant.id)"
     class="bg-black/10 border p-4 rounded shadow hover:bg-gray-300 transition">

   <div class="flex justify-between items-center mb-2" >

    <h3 class="text-lg font-semibold cursor-pointer" >
      {{  assistant.name }}
    </h3>

          <div v-if="layoutStore.isSidebarOpen" class="flex gap-2">
            <button class="text-gray-500 " @click="openEdit(assistant)">
              <LucidePencil class="hover:scale-110 transition" :size="20"/>
            </button>
            <button class="text-blue-500 " @click.stop="handleToSetup(assistant.id)">
              <LucideSettings class="hover:scale-110 transition" :size="20"/>
            </button>
            <button class="text-red-500 " @click="openDeleteModal(assistant)">
             <LucideTrash2 class="hover:scale-110 transition" :size="20"/>
            </button>
          </div>

        </div>
        <p v-if="layoutStore.isSidebarOpen" class="text-sm text-gray-600 cursor-pointer" >
        {{ assistant.description }}
        </p>
      </div>
    </div>

    <!-- 新增助手弹窗 -->
    <AddAssistantModal v-if="showAddModal" @close="showAddModal = false" @submit="handleAddAssistant" />
    <!-- 编辑助手弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-1/3 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">编辑助手</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="showEditModal = false">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleEdit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入名称" v-model="editAssistant.name" required>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3" placeholder="请输入描述" v-model="editAssistant.description"></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">模型</label>
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="editAssistant.model">
              <option :value="LLMType.QWEN_TURBO">Qwen Turbo</option>
              <option :value="LLMType.QWEN_PLUS">Qwen Plus</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              @click="showEditModal = false">
              取消
            </button>
            <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
              <i class="fa fa-check mr-1"></i>保存
            </button>
          </div>
        </form>
      </div>
    </div>
    <!--删除弹窗-->
    <div v-if="showDeleteModal" class="fixed inset-0 flex bg-black/30 items-center justify-center z-20">

      <div class="bg-white p-6 rounded-lg w-1/3">
        <h3 class="text-xl font-bold mb-4">确认删除</h3>
        <p class="text-gray-500 mb-4">是否确认删除{{ delAssistant?.name }}?</p>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteModal = false"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
            取消
          </button>
          <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            删除
          </button>
        </div>
      </div>
    </div>

  </aside>
</template>
<!-- AssistantList.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddAssistantModal from './AddAssistantModal.vue';
import { useAssistantStore } from '@/stores/AssistantStore';
import { useRouter } from 'vue-router';
import { LucideTrash2, LucidePencil ,LucideSettings,LucidePanelLeftClose,LucidePanelLeftOpen, FileX} from 'lucide-vue-next';
import { LLMType } from '@/enums/LLMType';
import { Assistant } from '@/model/Assistant';
import { useLayoutStore } from '@/stores/LayoutStore';


const assistantStore = useAssistantStore()
const router = useRouter();
const showAddModal = ref(false);
const showEditModal = ref(false);
const editAssistant = ref<Partial<Assistant>>({});
const showDeleteModal = ref(false)
const delAssistant = ref<Assistant | null>(null); 

const layoutStore = useLayoutStore();

const toggleSidebar = layoutStore.toggleSidebar;

onMounted(async () => {
  const firstAssistantId = await assistantStore.initializeAssistants();
  if (firstAssistantId) {
    router.push({
      path: '/',
      query: { assistantId: firstAssistantId }
    });
  }


});

// 添加助手
const handleAddAssistant = async (assistant: Assistant) => {
  const result = await assistantStore.addAssistant(assistant);
  console.log(result);
  if (result && result.code === 200) {
    showAddModal.value = false;
  } else {
    console.error('创建助手失败:', result?.msg);
  }
};


// 删除助手
const confirmDelete = async () => {
  if (!delAssistant.value) return;
  await assistantStore.deleteAssistant(delAssistant.value.id);
  delAssistant.value = null;
  showDeleteModal.value = false;
};

const openDeleteModal = (assistant: Assistant) => {
  delAssistant.value = assistant;
  showDeleteModal.value = true;
}



// 打开编辑弹窗
const openEdit = (assistant: Assistant) => {
  editAssistant.value = { ...assistant };
  showEditModal.value = true;
};

// 处理编辑提交
const handleEdit = async () => {
  if (!editAssistant.value.id) {
    console.error('无效的助手ID');
    return;
  }

  const result = await assistantStore.updateAssistant(
    editAssistant.value.id,
    editAssistant.value as Assistant
  );

  if (result && result.code === 200) {
    showEditModal.value = false;
    console.log("助手更新成功");
  } else {
    console.error('更新助手失败:', result?.msg);
  }
};

// 跳转到设置页面
const handleToSetup = (id: string) => {
   console.log('准备跳转到 /setup，参数 id：', id);
   
   router.push({
    path: '/setup',
    query: { id }
  });
};


const selectAssistant = (id: string) => {
  assistantStore.selectAssistant(id)
  router.push({
    path: '/',
    query: { assistantId: id }
  })
}
</script>

<style scoped>
button {
  cursor: pointer;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道背景 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1; /* 滚动条滑块颜色 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 鼠标悬停时滑块颜色 */
}

/* 侧边栏展开时的滚动条样式 */
:deep(.custom-scrollbar) {
  scrollbar-width: thin; /* Firefox 滚动条宽度 */
  scrollbar-color: #c1c1c1 #f1f1f1; /* Firefox 滚动条颜色 */
}

/* 侧边栏收起时隐藏滚动条（可选） */
:deep(.w-16 .custom-scrollbar::-webkit-scrollbar) {
  display: none;
}
</style>