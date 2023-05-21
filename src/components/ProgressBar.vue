<script lang="ts" setup>

import { computed } from 'vue';
import { useProgressStore } from '@/stores/ProgressStore';
import Stage from '@components/Stage.vue'

const progressInStore = useProgressStore();

const overallScore = computed((): number =>
  progressInStore.progress
    .flatMap((item) => item.games)
    .reduce((acc: number, curr: { name: string; bestResult: number; isPlayed: boolean }) => acc + curr.bestResult, 0),
);

const thresholdPoints = computed(() => progressInStore.progress.map((item) => item.thresholdPoints));
const segmentWidth = computed(() =>
  progressInStore.progress[progressInStore.segmentsCount - 1]
    .thresholdPoints / progressInStore.segmentsCount / 10);

const barCompletion = computed(() => {
  const lowerThreshold = () => {
    const lower = thresholdPoints.value.findLast((item: number) => item <= overallScore.value);
    return lower ? lower : 0;
  };
  const higherThreshold = (): number => {
    const higher = thresholdPoints.value.find((item: number) => item >= overallScore.value);
    return higher ? higher : thresholdPoints.value.at(-1);
  };

  const filler = () => {
    const pointsInCurrentSegment = () => {
      if (overallScore.value >= 0) {
        return overallScore.value - lowerThreshold();
      }
      return 0;
    };
    const currentSegmentRange = higherThreshold() - lowerThreshold();
    const currentSegmentFilled = () => {
      if (pointsInCurrentSegment && currentSegmentRange) {
        return (pointsInCurrentSegment() / currentSegmentRange) * segmentWidth.value;
      }
      return 0;
    };
    const alreadyFilled = thresholdPoints.value.filter((item) => item <= overallScore.value).length;

    const filledPercentage = (segmentWidth.value * 100 * alreadyFilled) / 100 + currentSegmentFilled();

    return {
      'background-position-x': `-${filledPercentage}%`,
    };
  };
  return filler();
});

</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar__overlay" :style="barCompletion" />
    <div class="progress-bar__segments">
      <Stage :data="currentProgress" :thresholds="thresholdPoints" :key="currentProgress.id"
        v-for="currentProgress in progressInStore.progress" />
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
