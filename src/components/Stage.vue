<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useProgressStore } from '@/stores/ProgressStore';
import StarIcon from '@assets/svg/star.svg';
import Trophy from '@assets/svg/trophy.svg';
const progressInStore = useProgressStore();

interface IStage {
  name: string;
  id: number;
  thresholdPoints: number;
  games: { name: string; bestResult: number; isPlayed: boolean }[];
}

const props = defineProps({
  data: Object as PropType<IStage>
})

const segmentScore = computed(() => {
  const OS = progressInStore.overallScore;
  const TH = props.data.thresholdPoints;
  const STH = progressInStore.thresholdPoints;
  const currentIndex = props.data.id - 1;

  const prevThreshold = () => {
    if (currentIndex === 0) {
      return (0);
    }
    return STH[currentIndex - 1];
  }

  if ((TH >= OS && prevThreshold() < OS) || (OS >= TH && STH.findIndex(item => item === STH.at(-1)) === currentIndex)) {
    return `${OS} / ${TH}`
  }
  return TH
})

const indicatorFilled = computed(
  () => {
    if (props.data.games.every(item => item.isPlayed === true) && progressInStore.overallScore >= props.data.thresholdPoints) {
      return true
    }
    return false
  })


</script>

<template>
  <div class="progress-bar__segment">
    <!-- {{ props.data.games.every(item => item.isPlayed === true) && progressInStore.overallScore >=
      props.data.thresholdPoints }} -->
    <div class="progress-bar__indicator" v-if="progressInStore.thresholdPoints.at(-1) === props.data.thresholdPoints">
      <Trophy :style="indicatorFilled ? { opacity: 1 } : { opacity: 0 }" />
    </div>
    <div class="progress-bar__indicator" v-else>
      <StarIcon :style="indicatorFilled ? { fill: '#3300FF' } : { fill: 'none' }" />
    </div>
    <p class="progress-bar__threshold">{{ segmentScore }}</p>
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
        top: calc(100% + 13px);
        left: -50%;
        width: 100%;
        display: grid;

        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: -0.01em;

        opacity: 0.5;
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
  }

  &__threshold {
    position: absolute;
    top: calc(100% + 13px);
    right: -50%;
    width: 100%;
    display: grid;
    align-items: center;
    margin: 0;

    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: -0.01em;

    opacity: 0.5;
  }
}
</style>