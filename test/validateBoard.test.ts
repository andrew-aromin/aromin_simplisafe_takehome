import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBoard } from '../src/validateBoard.ts';
import { BoardValidationError } from '../src/errors.ts';
import { BOARD_SIZE } from '../src/types.ts';

test('validateBoard', async (t) => {
  await t.test('accepts valid boards', () => {
    const emptyBoard = Array.from({ length: 4 }, () => [null, null, null, null]);
    const validated = validateBoard(emptyBoard);
    assert.ok(validated);
  });

  await t.test('rejects non-arrays', () => {
    assert.throws(() => validateBoard(null), BoardValidationError);
    assert.throws(() => validateBoard(undefined), BoardValidationError);
    assert.throws(() => validateBoard('string'), BoardValidationError);
    assert.throws(() => validateBoard(42), BoardValidationError);
    assert.throws(() => validateBoard({}), BoardValidationError);
    assert.throws(() => validateBoard({ length: 4 }), BoardValidationError);
  });

  await t.test('rejects wrong board dimensions', () => {
    const threeRows = Array.from({ length: 3 }, () => [null, null, null, null]);
    const fiveRows = Array.from({ length: 5 }, () => [null, null, null, null]);
    
    assert.throws(() => validateBoard(threeRows), BoardValidationError);
    assert.throws(() => validateBoard(fiveRows), BoardValidationError);
  });

  await t.test('rejects wrong row dimensions', () => {
    const wrongRows = [
      [null, null, null, null],
      [null, null, null],
      [null, null, null, null],
      [null, null, null, null, null]
    ];
    assert.throws(() => validateBoard(wrongRows), BoardValidationError);
  });

  await t.test('rejects invalid cell values', () => {
    const badValues = ['x', '', ' ', 0, undefined, {}, 'XO', new String('X')];
    
    for (const val of badValues) {
      const board = Array.from({ length: 4 }, () => [null, null, null, null]);
      (board[0] as any)[0] = val;
      assert.throws(() => validateBoard(board), BoardValidationError, `Should reject cell value: ${String(val)}`);
    }
  });

  await t.test('rejects sparse arrays', () => {
    const board = Array.from({ length: 4 }, () => new Array(4));
    assert.throws(() => validateBoard(board), BoardValidationError);
  });

  await t.test('returns a deeply frozen copy', () => {
    const input = Array.from({ length: 4 }, () => [null, null, null, null]);
    const validated = validateBoard(input);
    
    assert.ok(Object.isFrozen(validated));
    for (let i = 0; i < BOARD_SIZE; i++) {
      assert.ok(Object.isFrozen(validated[i]));
    }
  });

  await t.test('isolates from caller mutations', () => {
    const input = Array.from({ length: 4 }, () => [null, null, null, null]);
    const validated = validateBoard(input);
    
    // Mutate the original input
    (input[0] as any)[0] = 'X';
    
    // The validated board should remain unchanged
    assert.equal(validated[0]![0], null);
  });

  await t.test('does not echo raw input in error messages', () => {
    const board = Array.from({ length: 4 }, () => [null, null, null, null]);
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
