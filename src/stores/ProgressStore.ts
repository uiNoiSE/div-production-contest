import { defineStore } from 'pinia';

export const useProgressStore = defineStore('ProgressStore', {
  state: () => ({
    progress: [],
  }),

  actions: {
    async fill() {
      this.progress = (await import('@/data/mock.json')).default;
    },

    inc(q: number) {
      this.progress[0].games[0].bestResult += q;
    },

    dec(q: number) {
      this.progress[0].games[0].bestResult -= q;
    },
  },

  getters: {
    segmentsCount(state): number {
      return Object.keys(state.progress).length;
    },
    overallScore: (state) =>
      state.progress.flatMap((item) => item.games).reduce((acc, curr) => acc + curr.bestResult, 0),
    thresholdPoints: (state) => state.progress.map((item) => item.thresholdPoints),
    segmentWidth(state) {
      const width = state.progress[this.segmentsCount - 1]?.thresholdPoints / this.segmentsCount / 10;
      return width;
    },
    barCompletion(): { 'background-position-x': string } {
      const lowerThreshold = () => {
        const lower = this.thresholdPoints.findLast((item: number) => item <= this.overallScore);
        return lower ? lower : 0;
      };
      const higherThreshold = (): number => {
        const higher = this.thresholdPoints.find((item: number) => item >= this.overallScore);
        return higher ? higher : this.thresholdPoints.at(-1);
      };

      const filler = () => {
        const pointsInCurrentSegment = () => {
          if (this.overallScore >= 0) {
            return this.overallScore - lowerThreshold();
          }
          return 0;
        };
        const currentSegmentRange = higherThreshold() - lowerThreshold();
        const currentSegmentFilled = () => {
          if (pointsInCurrentSegment && currentSegmentRange) {
            return (pointsInCurrentSegment() / currentSegmentRange) * this.segmentWidth;
          }
          return 0;
        };
        const alreadyFilled = this.thresholdPoints.filter((item) => item <= this.overallScore).length;

        const filledPercentage = (this.segmentWidth * 100 * alreadyFilled) / 100 + currentSegmentFilled();

        return {
          'background-position-x': `-${filledPercentage}%`,
        };
      };
      return filler();
    },
  },
});
