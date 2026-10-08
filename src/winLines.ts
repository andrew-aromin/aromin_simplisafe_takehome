import type { WinLine } from './types.ts';
import { BOARD_SIZE } from './types.ts';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function generateRows(): WinLine[] {
  return range(BOARD_SIZE).map((r) => range(BOARD_SIZE).map((c) => [r, c] as const));
}

function generateColumns(): WinLine[] {
  return range(BOARD_SIZE).map((c) => range(BOARD_SIZE).map((r) => [r, c] as const));
}

function generateDiagonals(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return [
    range(BOARD_SIZE).map((i) => [i, i] as const),
    range(BOARD_SIZE).map((i) => [i, last - i] as const),
  ];
}

function generateCorners(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return [[
    [0, 0] as const,
    [0, last] as const,
    [last, 0] as const,
    [last, last] as const
  ]];
}

function generateBoxes(): WinLine[] {
  const last = BOARD_SIZE - 1;
  return range(last).flatMap((r) =>
    range(last).map((c) => [
      [r, c] as const,
      [r, c + 1] as const,
      [r + 1, c] as const,
      [r + 1, c + 1] as const
    ])
  );
}

function deepFreeze<T>(obj: T): T {
  if (Array.isArray(obj)) {
    for (const item of obj) deepFreeze(item);
  }
  return Object.freeze(obj) as T;
}

/** Ordered: rows → columns → diagonals → corners → 2x2 boxes. Deep-frozen. */
export const WIN_LINES: readonly WinLine[] = deepFreeze([
  ...generateRows(),
  ...generateColumns(),
  ...generateDiagonals(),
  ...generateCorners(),
  ...generateBoxes(),
]);
