<script lang="ts" setup>
import { useProgressStore } from '@/stores/ProgressStore';
import ProgressBar from './components/ProgressBar.vue';

const progressInStore = useProgressStore();
progressInStore.fill();
</script>

<template>
  <main class="card">
    <ProgressBar />

    <div class="button-group">
      <button @click="progressInStore.dec(100)"> - 100 </button>
      <button @click="progressInStore.dec(50)"> - 50</button>
      <button @click="progressInStore.dec(5)"> - 5</button>
      <button @click="progressInStore.dec(1)"> - 1</button>

      <button @click="progressInStore.inc(1)"> + 1</button>
      <button @click="progressInStore.inc(5)"> + 5</button>
      <button @click="progressInStore.inc(50)"> + 50</button>
      <button @click="progressInStore.inc(100)"> + 100</button>
    </div>
  </main>
</template>
