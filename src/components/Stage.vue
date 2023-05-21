<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { useProgressStore } from '@/stores/ProgressStore';
import StarIcon from '@assets/svg/star.svg';
import Trophy from '@assets/svg/trophy.svg';
import { IStage } from '@/types';
const progressInStore = useProgressStore();

const props = defineProps({
  data: Object as PropType<IStage>,
  thresholds: Object as PropType<Array<number>>,
})

let isSegmentActive = ref(false);

const segmentScore = computed(() => {
  const OS = progressInStore.overallScore;
  const TH = props.data.thresholdPoints;
  const StageTH = props.thresholds;
  const currentIndex = props.data.id - 1;

  const prevThreshold = (): number => {
    if (currentIndex === 0) {
      return (0);
    }
    return StageTH[currentIndex - 1];
  }

  if ((TH >= OS && prevThreshold() < OS) ||
    (OS >= TH && StageTH.findIndex(item => item === StageTH.at(-1)) === currentIndex)) {
    isSegmentActive.value = true;
    return `${OS} / ${TH}`
  }
  isSegmentActive.value = false
  return TH
})

const indicatorFilled = computed(
  (): boolean => {
    if (props.data.games.every(item => item.isPlayed === true) && progressInStore.overallScore >= props.data.thresholdPoints) {
      return true
    }
    return false
  })


</script>

<template>
  <div class="progress-bar__segment">
    <div class="progress-bar__indicator progress-bar__indicator--last"
      v-if="props.thresholds.at(-1) === props.data.thresholdPoints">
      <Trophy :style="indicatorFilled ? { opacity: 1 } : { opacity: 0 }" />
    </div>
    <div class="progress-bar__indicator" v-else>
      <StarIcon :style="indicatorFilled ? { fill: '#3300FF' } : { fill: 'none' }" />
    </div>
    <p class="progress-bar__threshold" :class="{ 'progress-bar__threshold--active': isSegmentActive }">{{ segmentScore }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  &__segment {
    position: relative;
    min-width: 40px;
    width: 100%;
    height: 40px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);

    &:first-of-type {
      border-radius: 30px 0 0 30px;

      &:before {
        content: '0';
        position: absolute;
        top: calc(100% + 5px);
        left: -50%;
        width: 100%;
        display: grid;

        font-size: calc(10px + 0.390625vw);
        font-weight: 400;
        line-height: 17px;
        letter-spacing: -0.01em;

        color: #fff;
        opacity: 0.7;

        @media (min-width: 768px) {
          font-size: inherit;
          top: calc(100% + 13px);
        }
      }
    }

    &:last-of-type {
      border-radius: 0 30px 30px 0;
      border: none;

      .progress-bar__threshold {
        right: 0;
        justify-content: flex-end;
      }
    }
  }

  &__indicator {
    position: absolute;
    width: 50px;
    height: 25px;
    top: -32px;
    right: -25px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      transition: $t-primary;
    }

    &--last {
      right: -5px;
    }
  }

  &__threshold {
    position: absolute;
    top: calc(100% + 5px);
    right: -50%;
    width: 100%;
    display: grid;
    align-items: center;
    margin: 0;

    font-size: calc(10px + 0.390625vw);
    font-weight: 400;
    line-height: 17px;
    letter-spacing: -0.01em;
    white-space: nowrap;

    transition: $t-primary;
    color: #fff;
    opacity: 0.7;

    &--active {
      top: 150%;
    }

    @media (min-width: 768px) {
      font-size: inherit;
      top: calc(100% + 13px);

      &--active {
        top: calc(150% + 13px);
      }
    }
  }

  @media (prefers-color-scheme: light) {

    .progress-bar__segment:first-of-type:before,
    .progress-bar__threshold {
      color: #000;
      opacity: 0.5;
    }
  }
}
</style>
