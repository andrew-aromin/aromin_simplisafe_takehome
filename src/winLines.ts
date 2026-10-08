import type { WinLine } from './types.ts';
import { BOARD_SIZE } from './types.ts';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const LAST = BOARD_SIZE - 1;

const rows = range(BOARD_SIZE).map((r) => range(BOARD_SIZE).map((c) => [r, c]));
const columns = range(BOARD_SIZE).map((c) => range(BOARD_SIZE).map((r) => [r, c]));
const diagonals = [
  range(BOARD_SIZE).map((i) => [i, i]),
  range(BOARD_SIZE).map((i) => [i, LAST - i]),
];
const corners = [[[0, 0], [0, LAST], [LAST, 0], [LAST, LAST]]];
const boxes = range(LAST).flatMap((r) =>
  range(LAST).map((c) => [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]]),
);

function deepFreeze<T>(obj: T): T {
  if (Array.isArray(obj)) {
    for (const item of obj) deepFreeze(item);
  }
  return Object.freeze(obj);
}

/** Ordered: rows → columns → diagonals → corners → 2x2 boxes. Deep-frozen. */
export const WIN_LINES: readonly WinLine[] = deepFreeze([
  ...rows, ...columns, ...diagonals, ...corners, ...boxes,
] as unknown as WinLine[]);
