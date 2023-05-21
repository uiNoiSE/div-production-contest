export interface IStage {
  name: string;
  id: number;
  thresholdPoints: number;
  games: IGame[];
}

export interface IGame {
  name: string;
  bestResult: number;
  isPlayed: boolean;
}
