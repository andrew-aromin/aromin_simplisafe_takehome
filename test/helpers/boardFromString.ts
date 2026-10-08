import type { Board } from '../../src/types.ts';

/**
 * Builds a board from a string representation for tests.
 * e.g., 'XXXX/..../..../....'
 */
export function boardFromString(str: string): Board {
  const rows = str.split('/');
  if (rows.length !== 4) throw new Error('Need 4 rows separated by /');
  
  return rows.map(row => {
    if (row.length !== 4) throw new Error('Row must be exactly 4 chars');
    return row.split('').map(char => {
      if (char === 'X') return 'X';
      if (char === 'O') return 'O';
      if (char === '.') return null;
      throw new Error(`Invalid char ${char}`);
    });
  }) as unknown as Board;
}
