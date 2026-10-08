import type { Board, Cell } from '../../src/types.ts';
import { BOARD_SIZE } from '../../src/types.ts';

/**
 * Builds a board from a string representation for tests.
 * e.g., 'XXXX/..../..../....'
 */
export function boardFromString(str: string): Board {
  const rows = str.split('/');
  if (rows.length !== BOARD_SIZE) throw new Error(`Need ${BOARD_SIZE} rows separated by /`);
  
  return rows.map(row => {
    if (row.length !== BOARD_SIZE) throw new Error(`Row must be exactly ${BOARD_SIZE} chars`);
    return row.split('').map(char => {
      if (char === 'X') return 'X';
      if (char === 'O') return 'O';
      if (char === '.') return null;
      throw new Error(`Invalid char ${char}`);
    }) as Cell[];
  }) as Board;
}
