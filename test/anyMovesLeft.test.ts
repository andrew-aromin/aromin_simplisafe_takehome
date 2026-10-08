/**
 * Unit tests for the anyMovesLeft method of the TicTacToe class.
 * Ensures the game correctly identifies when the board is full or has remaining empty cells.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe } from '../src/index.ts';
import { boardFromString as board } from './helpers/boardFromString.ts';

test('anyMovesLeft', async (t) => {
  await t.test('returns true for empty board', () => {
    const game = new TicTacToe(board('..../..../..../....'));
    assert.equal(game.anyMovesLeft(), true);
  });

  await t.test('returns true for 1 empty cell', () => {
    const game = new TicTacToe(board('XXXX/XXXX/XXXX/XXX.'));
    assert.equal(game.anyMovesLeft(), true);
  });

  await t.test('returns false for full board', () => {
    const game = new TicTacToe(board('XOXO/XOXO/OXOX/OXOX'));
    assert.equal(game.anyMovesLeft(), false);
  });

  await t.test('Memoization works for anyMovesLeft', () => {
    const game = new TicTacToe(board('XXXX/XXXX/XXXX/XXX.'));
    assert.equal(game.anyMovesLeft(), true);
    assert.equal(game.anyMovesLeft(), true);
  });
});
