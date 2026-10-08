import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBoard } from '../src/validateBoard.ts';
import { BoardValidationError } from '../src/errors.ts';
import { BOARD_SIZE } from '../src/types.ts';

const createEmptyBoard = () => Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(null));

test('validateBoard', async (t) => {
  await t.test('accepts valid boards', () => {
    const emptyBoard = createEmptyBoard();
    const validated = validateBoard(emptyBoard);
    assert.ok(validated);
  });

  await t.test('rejects non-arrays', () => {
    assert.throws(() => validateBoard(null), BoardValidationError);
    assert.throws(() => validateBoard(undefined), BoardValidationError);
    assert.throws(() => validateBoard('string'), BoardValidationError);
    assert.throws(() => validateBoard(42), BoardValidationError);
    assert.throws(() => validateBoard({}), BoardValidationError);
    assert.throws(() => validateBoard({ length: BOARD_SIZE }), BoardValidationError);
  });

  await t.test('rejects wrong board dimensions', () => {
    const smallBoard = Array.from({ length: BOARD_SIZE - 1 }, () => new Array(BOARD_SIZE).fill(null));
    const largeBoard = Array.from({ length: BOARD_SIZE + 1 }, () => new Array(BOARD_SIZE).fill(null));
    
    assert.throws(() => validateBoard(smallBoard), BoardValidationError);
    assert.throws(() => validateBoard(largeBoard), BoardValidationError);
  });

  await t.test('rejects wrong row dimensions', () => {
    const wrongRows = createEmptyBoard();
    wrongRows[1] = new Array(BOARD_SIZE - 1).fill(null);
    wrongRows[3] = new Array(BOARD_SIZE + 1).fill(null);
    assert.throws(() => validateBoard(wrongRows), BoardValidationError);
  });

  await t.test('rejects invalid cell values', () => {
    const badValues = ['x', '', ' ', 0, undefined, {}, 'XO', new String('X')];
    
    for (const val of badValues) {
      const board = createEmptyBoard();
      (board[0] as any)[0] = val;
      assert.throws(() => validateBoard(board), BoardValidationError, `Should reject cell value: ${String(val)}`);
    }
  });

  await t.test('rejects sparse arrays', () => {
    const board = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE));
    assert.throws(() => validateBoard(board), BoardValidationError);
  });

  await t.test('returns a deeply frozen copy', () => {
    const input = createEmptyBoard();
    const validated = validateBoard(input);
    
    assert.ok(Object.isFrozen(validated));
    for (let i = 0; i < BOARD_SIZE; i++) {
      assert.ok(Object.isFrozen(validated[i]));
    }
  });

  await t.test('isolates from caller mutations', () => {
    const input = createEmptyBoard();
    const validated = validateBoard(input);
    
    // Mutate the original input
    (input[0] as any)[0] = 'X';
    
    // The validated board should remain unchanged
    assert.equal(validated[0]![0], null);
  });

  await t.test('does not echo raw input in error messages', () => {
    const board = createEmptyBoard();
    const payload = '<script>alert(1)</script>';
    (board[1] as any)[2] = payload;

    try {
      validateBoard(board);
      assert.fail('Should have thrown');
    } catch (e: any) {
      assert.ok(e instanceof BoardValidationError);
      assert.ok(!e.message.includes(payload), 'Error message should not contain raw input');
    }
  });
});
