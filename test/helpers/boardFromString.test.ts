import test from 'node:test';
import assert from 'node:assert/strict';
import { boardFromString } from './boardFromString.ts';

test('boardFromString', async (t) => {
  await t.test('throws on invalid row count', () => {
    assert.throws(() => boardFromString('..../..../....'), /Need 4 rows/);
  });

  await t.test('throws on invalid column count', () => {
    assert.throws(() => boardFromString('...../..../..../....'), /Row must be exactly 4 chars/);
  });

  await t.test('throws on invalid char', () => {
    assert.throws(() => boardFromString('...Z/..../..../....'), /Invalid char Z/);
  });

  await t.test('parses correctly', () => {
    const board = boardFromString('X.../.O../..X./...O');
    assert.equal(board[0]![0], 'X');
    assert.equal(board[1]![1], 'O');
    assert.equal(board[2]![2], 'X');
    assert.equal(board[3]![3], 'O');
    assert.equal(board[0]![1], null);
  });
});
