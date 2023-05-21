<script lang="ts" setup>
import { useProgressStore } from '@/stores/ProgressStore';
import ProgressBar from './components/ProgressBar.vue';

const progressInStore = useProgressStore();
</script>

<template>
  <main class="card">
    <ProgressBar />

    <div class="button-group">
      <button @click="progressInStore.dec(100)"> - 100 </button>
      <button @click="progressInStore.dec(50)"> - 50</button>
      <button @click="progressInStore.dec(5)"> - 5</button>

      <button @click="progressInStore.inc(5)"> + 5</button>
      <button @click="progressInStore.inc(50)"> + 50</button>
      <button @click="progressInStore.inc(100)"> + 100</button>
    </div>

    <div class="button-group">
      <button class="button-select" :class="{ 'button-select--active': progressInStore.currentStage === index }"
        :key="stage.id" v-for="(stage, index) in progressInStore.progress" @click="progressInStore.changeStage(index)">
        {{ stage.name }}</button>
    </div>

    <div class="button-group">
      <button class="button-select" :class="{ 'button-select--active': progressInStore.currentGame === index }"
        :key="game.name" v-for="(game, index) in progressInStore.progress[progressInStore.currentStage].games"
        @click="progressInStore.pickGame(index)">
        {{ game.name }}</button>
    </div>

    <button @click="progressInStore.$reset()" class="button--danger"> Reset all progress</button>
  </main>
</template>
