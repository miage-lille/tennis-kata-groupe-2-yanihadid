import { Player } from './player';


export type Love = {
  kind: 'LOVE';
};

export const love = (): Love => ({
  kind: 'LOVE',
});

export type Fifteen = {
  kind: 'FIFTEEN';
};

export const fifteen = (): Fifteen => ({
  kind: 'FIFTEEN',
});

export type Thirty = {
  kind: 'THIRTY';
};

export const thirty = (): Thirty => ({
  kind: 'THIRTY',
});


export type Point = Love | Fifteen | Thirty;

// Exerice 0: Write all type constructors of Points, Deuce, Forty and Advantage types.
export type FortyData = {
  player: Player; // The player who have forty points
  otherPoint: Point; // Points of the other player
};

export const fortyData = (player: Player, otherPoint: Point): FortyData => ({
  player,
  otherPoint,
});

export type Deuce = {
  kind: 'DEUCE';
};

export const deuce = (): Deuce => ({
  kind: 'DEUCE',
});

export type Forty = {
  kind: 'FORTY';
  fortyData: FortyData;
};

export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  fortyData: { player, otherPoint },
});

export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player;
};

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});




export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};

export type Points = {
  kind: 'POINTS';
  pointsData: PointsData;
};

export const points = (
  playerOnePoints: Point,
  playerTwoPoints: Point
): Points => ({
  kind: 'POINTS',
  pointsData: {
    PLAYER_ONE: playerOnePoints,
    PLAYER_TWO: playerTwoPoints,
  },
});

export type Game = {
  kind: 'GAME';
  player: Player; // Player has won
};

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});

export type Score = Points | Forty | Deuce | Advantage | Game;


