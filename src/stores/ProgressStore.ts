import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, computed } from 'vue';
import mock from '@/data/mock.json';
import { IGame } from '@/types';

const defaultState = {
  progress: mock,
  currentStage: 0,
  currentGame: 0,
};

export const useProgressStore = defineStore('ProgressStore', () => {
  // state
  const progress = useStorage('progress', ref(structuredClone(defaultState.progress)));
  const currentStage = useStorage('currentStage', ref(structuredClone(defaultState.currentStage)));
  const currentGame = useStorage('currentGame', ref(structuredClone(defaultState.currentGame)));

  // actions
  function inc(q: number): void {
    const item = progress.value[currentStage.value].games[currentGame.value];
    item.bestResult += q;

    if (item.bestResult > 0 && item.isPlayed === false) {
      item.isPlayed = true;
    }
  }

  function dec(q: number): void {
    const item = progress.value[currentStage.value].games[currentGame.value];
    item.bestResult -= q;

    if (item.bestResult > 0 && item.isPlayed === false) {
      item.isPlayed = true;
    }
  }

  function changeStage(stage: number) {
    currentStage.value = stage;
    pickGame(0);
  }

  function pickGame(index: number) {
    currentGame.value = index;
  }

  function $reset() {
    progress.value = structuredClone(defaultState.progress);
    currentStage.value = structuredClone(defaultState.currentStage);
    currentGame.value = structuredClone(defaultState.currentGame);
  }

  // getters
  const segmentsCount = computed(() => Object.keys(progress.value).length);
  const overallScore = computed((): number =>
    progress.value.flatMap((item) => item.games).reduce((acc: number, curr: IGame) => acc + curr.bestResult, 0),
  );

  return { progress, currentStage, currentGame, inc, dec, changeStage, pickGame, $reset, segmentsCount, overallScore };
});
