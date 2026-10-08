import type { Board, Cell, Row } from './types.ts';
import { BOARD_SIZE } from './types.ts';
import { BoardValidationError } from './errors.ts';

/**
 * Validates untrusted input and returns a deep-frozen copy.
 * Reads each cell exactly once, so getters/Proxies can't change values after validation.
 */
export function validateBoard(input: unknown): Board {
  if (!Array.isArray(input) || input.length !== BOARD_SIZE) {
    throw new BoardValidationError(`Board must be an array of ${BOARD_SIZE} rows`);
  }
  
  const rows: Row[] = new Array(BOARD_SIZE);
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: unknown = input[r];
    if (!Array.isArray(row) || row.length !== BOARD_SIZE) {
      throw new BoardValidationError(`Row ${r} must be an array of ${BOARD_SIZE} cells`);
    }
    
    const cells: Cell[] = new Array(BOARD_SIZE);
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell: unknown = row[c];
      if (!isCell(cell)) {
        throw new BoardValidationError(`Invalid cell at (${r}, ${c}); expected 'X', 'O', or null`);
      }
      cells[c] = cell;
    }
    
    rows[r] = Object.freeze(cells);
  }
  
  return Object.freeze(rows);
}

const isCell = (v: unknown): v is Cell => v === null || v === 'X' || v === 'O';
