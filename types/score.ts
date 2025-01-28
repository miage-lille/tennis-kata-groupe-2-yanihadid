import { Player , isSamePlayer } from './player';
import { none, some, Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import { match as matchOpt } from 'fp-ts/Option';

// Surely not the best choice
export type Point = number;

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

// Game type and constructor
export type Game = {
  kind: 'GAME';
  player: Player; 
};

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});

// Exercise 0: Write all type constructors of Points, Deuce, Forty, and Advantage types.

// Define new types
export type Deuce = {
  kind: 'DEUCE';
};

export type FortyData = {
  player: Player;
  opponentPoints: Point;
};

export type Forty = {
  kind: 'FORTY';
  fortyData: FortyData; // Include the fortyData field
};



export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player;
};

// Constructor for Deuce
export const deuce = (): Deuce => ({
  kind: 'DEUCE',
});

// Constructor for Forty
export const forty = (player: Player, opponentPoints: Point): Forty => ({
  kind: 'FORTY',
  player,
  opponentPoints,
});

// Constructor for Advantage
export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});

// Update Score to include new types
export type Score = Points | Game | Deuce | Forty | Advantage;


export const incrementPoint = (point: Point): Option<Point> => {
  switch (point) {
    case 0: // Love
      return some(15);
    case 15:
      return some(30);
    case 30:
      return none; // Cannot increment beyond thirty
    default:
      throw new Error(`Invalid Point: ${point}`);
  }
};

export const scoreWhenForty = (currentForty: Forty, winner: Player): Score => {
  if (isSamePlayer(currentForty.player, winner)) {
    // The player with forty points wins
    return game(winner);
  }

  // Handle the case where the opponent wins
  return pipe(
    incrementPoint(currentForty.opponentPoints), // Attempt to increment the opponent's points
    matchOpt(
      () => deuce(), // If no increment is possible, it's deuce
      nextPoint => forty(currentForty.player, nextPoint) as Score // Update the opponent's points
    )
  );
};