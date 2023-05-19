<script lang="ts" setup>

import { useProgressStore } from '@/stores/ProgressStore';
import Stage from '@components/Stage.vue'

const progressInStore = useProgressStore();

</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar__overlay" :style="progressInStore.barCompletion" />
    <div class="progress-bar__segments">
      <Stage :data="currentProgress" v-for="currentProgress in progressInStore.progress" :key="currentProgress.id" />
    </div>
  </div>
</template>

<style lang="scss">
.progress-bar {
  position: relative;
  margin: 3em 0;

  &__segments {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    margin: 0;
    border: none;
    background-position-x: 0%;
    background-size: 200% 100%;
    background-image: linear-gradient(270deg, $c-primary, $c-primary 50%, $c-gray60 50%, $c-gray60 100%);
    transition: $t-primary;
  }
}
</style>
