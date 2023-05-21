import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, computed } from 'vue';
import mock from '@/data/mock.json';
import { IGame } from '@/types';

const defaultState = {
  progress: mock,
};

export const useProgressStore = defineStore('ProgressStore', () => {
  // state
  const progress = useStorage('progress', ref(JSON.parse(JSON.stringify(defaultState.progress))));

  // actions
  function inc(q: number) {
    this.progress[0].games[0].bestResult += q;
  }

  function dec(q: number) {
    this.progress[0].games[0].bestResult -= q;
  }

  function $reset() {
    Object.assign(progress.value, JSON.parse(JSON.stringify(defaultState.progress)));
  }

  // getters
  const segmentsCount = computed(() => Object.keys(progress.value).length);
  const overallScore = computed((): number =>
    progress.value.flatMap((item) => item.games).reduce((acc: number, curr: IGame) => acc + curr.bestResult, 0),
  );

  return { progress, inc, dec, $reset, segmentsCount, overallScore };
});
