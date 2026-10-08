/**
 * Unit tests for the checkWinner method of the TicTacToe class.
 * Tests all possible winning conditions (rows, columns, diagonals, corners, 2x2 boxes)
 * and edge cases like draws, no-winners, and memoization.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { TicTacToe, type WinLine } from '../src/index.ts';
import { boardFromString as board } from './helpers/boardFromString.ts';

test('checkWinner', async (t) => {
  await t.test('Horizontal win (Row 0)', () => {
    const game = new TicTacToe(board('XXXX/..../..../....'));
    assert.equal(game.checkWinner(), 'X');
    
    const game2 = new TicTacToe(board('OOOO/..../..../....'));
    assert.equal(game2.checkWinner(), 'O');
  });

  await t.test('Horizontal win (Row 3)', () => {
    const game = new TicTacToe(board('..../..../..../XXXX'));
    assert.equal(game.checkWinner(), 'X');
  });

  await t.test('Vertical win (Col 0)', () => {
    const game = new TicTacToe(board('X.../X.../X.../X...'));
    assert.equal(game.checkWinner(), 'X');
  });

  await t.test('Vertical win (Col 3)', () => {
    const game = new TicTacToe(board('...O/...O/...O/...O'));
    assert.equal(game.checkWinner(), 'O');
  });

  await t.test('Diagonal win (main)', () => {
    const game = new TicTacToe(board('X.../.X../..X./...X'));
    assert.equal(game.checkWinner(), 'X');
  });

  await t.test('Diagonal win (anti)', () => {
    const game = new TicTacToe(board('...O/..O./.O../O...'));
    assert.equal(game.checkWinner(), 'O');
  });

  await t.test('Four corners win', () => {
    const game = new TicTacToe(board('X..X/..../..../X..X'));
    assert.equal(game.checkWinner(), 'X');
  });

  await t.test('2x2 box win (top left)', () => {
    const game = new TicTacToe(board('OO../OO../..../....'));
    assert.equal(game.checkWinner(), 'O');
  });

  await t.test('2x2 box win (bottom right)', () => {
    const game = new TicTacToe(board('..../..../..XX/..XX'));
    assert.equal(game.checkWinner(), 'X');
  });

  await t.test('No winner (empty board)', () => {
    const game = new TicTacToe(board('..../..../..../....'));
    assert.equal(game.checkWinner(), null);
  });

  await t.test('No winner (full draw board)', () => {
    const game = new TicTacToe(board('XOXO/XOXO/OXOX/OXOX'));
    assert.equal(game.checkWinner(), null);
  });

  await t.test('No winner (3 of 4)', () => {
    const game = new TicTacToe(board('XXX./..../..../....'));
    assert.equal(game.checkWinner(), null);
  });

  await t.test('No winner (L-shape)', () => {
    const game = new TicTacToe(board('XX../X.../..../....'));
    assert.equal(game.checkWinner(), null);
  });

  await t.test('Both win - determinism test', () => {
    const game = new TicTacToe(board('XXXX/OOOO/..../....'));
    assert.equal(game.checkWinner(), 'X');
    
    const game2 = new TicTacToe(board('OOOO/XXXX/..../....'));
    assert.equal(game2.checkWinner(), 'O');
  });

  await t.test('Custom win lines (empty line)', () => {
    const game = new TicTacToe(board('XXXX/..../..../....'), [[]]);
    assert.equal(game.checkWinner(), null);
  });

  await t.test('Custom win lines (out of bounds line)', () => {
    const game = new TicTacToe(board('XXXX/..../..../....'), [[[4, 4], [0, 0]]] as unknown as WinLine[]);
    assert.equal(game.checkWinner(), null);
  });

  await t.test('Memoization works for checkWinner', () => {
    const game = new TicTacToe(board('XXXX/..../..../....'));
    assert.equal(game.checkWinner(), 'X');
    assert.equal(game.checkWinner(), 'X');
  });
});
