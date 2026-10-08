/**
 * Public API for the Tic-Tac-Toe module.
 * Exports the main game class, custom errors, and core types.
 */
export { TicTacToe } from './TicTacToe.ts';
export { BoardValidationError } from './errors.ts';
export type { Board, Cell, Player, Row, Coordinate, WinLine } from './types.ts';
