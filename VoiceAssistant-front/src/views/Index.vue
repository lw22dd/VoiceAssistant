<template>
  <div class="flex flex-col flex-1 min-h-screen bg-gray-50">

    <Header />

    <main class="flex flex-1 container mx-auto p-4">
      <AssistantList />
        <Main />

    </main>



    <Footer />


  </div>

</template>


<script setup lang="ts">
import AssistantList from '@/components/AssistantList.vue';
import Main from '@/components/Main.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';




</script>
