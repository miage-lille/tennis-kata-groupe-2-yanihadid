import { isSamePlayer, Player } from './types/player';
import { game, points, PointsData, Score } from './types/score';
import { advantage, deuce, fifteen, forty, FortyData, love, Point, thirty } from './types/score';

import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'PLAYER_TWO';
    case 'PLAYER_TWO':
      return 'PLAYER_ONE';
  }
};

// Exercice 1 :
export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE': return '0';
    case 'FIFTEEN': return '15';
    case 'THIRTY': return '30';
  }
};

const formatPoints = (player: Player, pointsData: PointsData) =>
  `${playerToString(player)}: ${pointToString(pointsData[player])}`;

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return `${formatPoints('PLAYER_ONE', score.pointsData)} - ${formatPoints('PLAYER_TWO', score.pointsData)}`;
    case 'FORTY':
      return `${playerToString(score.fortyData.player)}: 40 - ${playerToString(otherPlayer(score.fortyData.player))}: ${pointToString(score.fortyData.otherPoint)}`;
    case 'DEUCE':
      return `Deuce`;
    case 'ADVANTAGE':
      return `Advantage: ${playerToString(score.player)}`;
    case 'GAME':
      return `Game: ${playerToString(score.player)}`;
  }
};


export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};

export const scoreWhenForty = (
  currentForty: FortyData, 
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    matchOpt(
      () => deuce(),
      p => forty(currentForty.player, p) as Score
    )
  );
};

export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
};

// Exercice 2
// Tip: You can use pipe function from fp-ts to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  return pipe(
    incrementPoint(current[winner]),
    matchOpt(
      () => forty(winner, current[otherPlayer(winner)]),
      (newPoint) => ({
        kind: 'POINTS',
        pointsData: {
          ...current,
          [winner]: newPoint,
        },
      } as Score)
    )
  );
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'ADVANTAGE':
      return scoreWhenAdvantage(currentScore.player, winner);
    case 'DEUCE':
      return scoreWhenDeuce(winner);
    case 'GAME':
      return scoreWhenGame(winner);
  }
};

export const incrementPoint = (point: Point): Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return some(fifteen());
    case 'FIFTEEN':
      return some(thirty());
    case 'THIRTY':
      return none;
  }
};

const simulateGame = () => {
  let currentScore: Score = points(love(), love());
  console.log("🎾 Début du jeu 🎾");

  const players: Player[] = ['PLAYER_ONE', 'PLAYER_TWO'];
  let round = 1;

  while (currentScore.kind !== 'GAME') {
    const winner = players[Math.floor(Math.random() * players.length)];
    currentScore = score(currentScore, winner);
    console.log(`🏆 Point ${round}: ${playerToString(winner)} gagne!`);
    console.log(`🔹 Score actuel: ${scoreToString(currentScore)}\n`);
    round++;
  }

  console.log(`🎉 Match terminé! ${playerToString(currentScore.player)} a gagné!`);
};

simulateGame();