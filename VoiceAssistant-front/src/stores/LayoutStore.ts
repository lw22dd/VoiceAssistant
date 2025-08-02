import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
    // 定义状态
    const isSidebarOpen = ref(true); // 侧边栏是否打开
    

    // 切换侧边栏状态
    const toggleSidebar = () => {

        isSidebarOpen.value = !isSidebarOpen.value;
    };

 
    return {

        isSidebarOpen,
      
        toggleSidebar,
     
    };
});