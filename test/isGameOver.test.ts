import test from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe } from '../src/TicTacToe.ts';
import { boardFromString as board } from './helpers/boardFromString.ts';

test('isGameOver', async (t) => {
  await t.test('false for empty board', () => {
    const game = new TicTacToe(board('..../..../..../....'));
    assert.equal(game.isGameOver(), false);
  });

  await t.test('false for partial board with no winner', () => {
    const game = new TicTacToe(board('X.../..../..../....'));
    assert.equal(game.isGameOver(), false);
  });

  await t.test('true for partial board with winner', () => {
    const game = new TicTacToe(board('XXXX/..../..../....'));
    assert.equal(game.isGameOver(), true);
  });

  await t.test('true for full board with no winner', () => {
    const game = new TicTacToe(board('XOXO/XOXO/OXOX/OXOX'));
    assert.equal(game.isGameOver(), true);
  });

  await t.test('true for full board with winner', () => {
    const game = new TicTacToe(board('XXXX/XOXO/OXOX/OXOX'));
    assert.equal(game.isGameOver(), true);
  });
});
