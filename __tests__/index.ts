import { describe, expect, test } from '@jest/globals';
import { 
  otherPlayer, 
  playerToString, 
  scoreWhenForty, 
  scoreWhenPoint, 
  scoreWhenAdvantage, 
  scoreWhenDeuce 
} from '..';

import * as fc from 'fast-check';
import * as G from './generators';
import { 
  deuce, 
  forty, 
  advantage, 
  game, 
  Point, 
  thirty 
} from '../types/score';
import { isSamePlayer } from '../types/player';

describe('🎾 Utility Functions Tests', () => {
  test('Convert PLAYER_ONE to readable string', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Identify the opponent of a player', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('🏆 Scoring System Transitions', () => {
  test('Winning from deuce results in advantage', () => {
    fc.assert(
      fc.property(G.getPlayer(), winner => {
        const score = scoreWhenDeuce(winner);
        const expectedScore = advantage(winner);
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

  test('Advantaged player wins → Game is won', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const expectedScore = game(winner);
        fc.pre(isSamePlayer(advantagedPlayer, winner));
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

  test('Losing advantage brings back deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(!isSamePlayer(advantagedPlayer, winner));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const expectedScore = deuce();
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

  test('If a player at 40 wins, they win the game', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(isSamePlayer(fortyData.player, winner));
        const score = scoreWhenForty(fortyData, winner);
        const expectedScore = game(winner);
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

  test('Player at 40, opponent at 30 wins → Returns to deuce', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        fc.pre(fortyData.otherPoint.kind === 'THIRTY');
        const score = scoreWhenForty(fortyData, winner);
        const expectedScore = deuce();
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

  test('If a player at 40 loses to an opponent with 15, score becomes 40-30', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        fc.pre(fortyData.otherPoint.kind === 'FIFTEEN');
        const score = scoreWhenForty(fortyData, winner);
        const expectedScore = forty(fortyData.player, thirty());
        expect(score).toStrictEqual(expectedScore);
      })
    );
  });

 
  
  test('When both players have Love or 15, the score should remain in POINTS', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        const isLoveOrFifteen = (point: Point) =>
          point.kind === 'LOVE' || point.kind === 'FIFTEEN';
        const preconditions =
          isLoveOrFifteen(pointsData.PLAYER_ONE) &&
          isLoveOrFifteen(pointsData.PLAYER_TWO);

        if (!preconditions) {
          return true;
        }
        const newScore = scoreWhenPoint(pointsData, winner);
        return newScore.kind === 'POINTS';
      })
    );
  });

  test('If a player at 30 wins, they advance to 40 points', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        const isThirty = (point: Point) => point.kind === 'THIRTY';
        const preconditions = 
          (isThirty(pointsData.PLAYER_ONE) && winner == 'PLAYER_ONE') || 
          (isThirty(pointsData.PLAYER_TWO) && winner == 'PLAYER_TWO');

        if (!preconditions) {
          return true;
        }

        const newScore = scoreWhenPoint(pointsData, winner);
        return newScore.kind === 'FORTY';
      })
    );
  });

});
