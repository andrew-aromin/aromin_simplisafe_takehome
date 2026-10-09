import type { WinLine } from './types.ts';
import { BOARD_SIZE } from './types.ts';

/**
 * Generates an array of numbers from 0 to n-1.
 * Used as a utility for iterating over board dimensions.
 */
//used const instead of function since it's a simple one line utility
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/**
 * Generates all horizontal win lines (rows).
 * Creates a coordinate array for each row from left to right.
 */
function generateRows(): WinLine[] {
  return range(BOARD_SIZE).map((r) => range(BOARD_SIZE).map((c) => [r, c] as const)) as unknown as WinLine[];
}

/**
 * Generates all vertical win lines (columns).
 * Creates a coordinate array for each column from top to bottom.
 */
function generateColumns(): WinLine[] {
  return range(BOARD_SIZE).map((c) => range(BOARD_SIZE).map((r) => [r, c] as const)) as unknown as WinLine[];
}

/**
 * Generates all diagonal win lines.
 * Creates coordinate arrays for the main diagonal and anti-diagonal.
 */
function generateDiagonals(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return [
    range(BOARD_SIZE).map((i) => [i, i] as const),
    range(BOARD_SIZE).map((i) => [i, last - i] as const),
  ] as unknown as WinLine[];
}

/**
 * Generates the four corner cells as a single win line.
 */
function generateCorners(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return [[
    [0, 0] as const,
    [0, last] as const,
    [last, 0] as const,
    [last, last] as const
  ]] as unknown as WinLine[];
}

/**
 * Generates all possible 2x2 boxes as win lines.
 * Iterates through the top-left coordinate of every 2x2 square on the board.
 */
function generateBoxes(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return range(last).flatMap((r) =>
    range(last).map((c) => [
      [r, c] as const,
      [r, c + 1] as const,
      [r + 1, c] as const,
      [r + 1, c + 1] as const
    ])
  ) as unknown as WinLine[];
}

function deepFreeze<T>(obj: T): T {
  if (Array.isArray(obj)) {
    for (const item of obj) deepFreeze(item);
  }
  return Object.freeze(obj) as T;
}

/**
 * Generates a static array of all possible winning coordinate lines exactly once when the file is loaded into memory.
 * Optimized over the naive approach to checking the 2x2 boxes or diagonals, since that would involve nested for-loops
 *  recalculating indices every time checkWinner() is called.
 * */
// ordered: rows → columns → diagonals → corners → 2x2 boxes. Deep-frozen.
export const WIN_LINES: readonly WinLine[] = deepFreeze([
  ...generateRows(),
  ...generateColumns(),
  ...generateDiagonals(),
  ...generateCorners(),
  ...generateBoxes(),
]);
