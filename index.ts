import { Player } from './types/player';
import { Point, PointsData, Score } from './types/score';
import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import * as fc from 'fast-check';
import { game, deuce, forty } from './types/score';
import {isSamePlayer } from './types/player';
import * as G from './__tests__/generators';


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
  switch (point) {
    case 0:
      return 'Love';
    case 15:
      return 'Fifteen';
    case 30:
      return 'Thirty';
    case 40:
      return 'Forty';
    default:
      throw new Error(`Invalid Point: ${point}`);
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS': {
      const { PLAYER_ONE, PLAYER_TWO } = score.pointsData;
      return `Player 1: ${pointToString(PLAYER_ONE)}, Player 2: ${pointToString(PLAYER_TWO)}`;
    }
    case 'DEUCE':
      return 'Deuce';
    case 'FORTY': {
      const { player, opponentPoints } = score;
      return `${playerToString(player)}: Forty, ${playerToString(
        otherPlayer(player)
      )}: ${pointToString(opponentPoints)}`;
    }
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    case 'GAME':
      return `Game won by ${playerToString(score.player)}`;
    default:
      throw new Error('Invalid Score type');
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  throw new Error('not implemented');
};

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  throw new Error('not implemented');
};

export const scoreWhenForty = (
  currentForty: unknown, // TO UPDATE WHEN WE KNOW HOW TO REPRESENT FORTY
  winner: Player
): Score => {
  throw new Error('not implemented');
};

export const scoreWhenGame = (winner: Player): Score => {
  throw new Error('not implemented');
};

// Exercice 2
// Tip: You can use pipe function from fp-ts to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  throw new Error('not implemented');
};

export const score = (currentScore: Score, winner: Player): Score => {
  throw new Error('not implemented');
};


test('Given a player at 40 when the same player wins, score is Game for this player', () => {
  fc.assert(
    fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
      // Player who has forty points wins
      fc.pre(isSamePlayer(fortyData.player, winner));
      const score = scoreWhenForty(fortyData, winner);
      const scoreExpected = game(winner);
      expect(score).toStrictEqual(scoreExpected);
    })
  );
});

test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
  fc.assert(
    fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
      // Other player wins
      fc.pre(!isSamePlayer(fortyData.player, winner));
      // Other player's points must be 30
      fc.pre(fortyData.opponentPoints === 30);
      const score = scoreWhenForty(fortyData, winner);
      const scoreExpected = deuce();
      expect(score).toStrictEqual(scoreExpected);
    })
  );
});

test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
  fc.assert(
    fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
      // Other player wins
      fc.pre(!isSamePlayer(fortyData.player, winner));
      // Other player's points must be 15
      fc.pre(fortyData.opponentPoints === 15);
      const score = scoreWhenForty(fortyData, winner);
      const scoreExpected = forty(fortyData.player, 30);
      expect(score).toStrictEqual(scoreExpected);
    })
  );
});
