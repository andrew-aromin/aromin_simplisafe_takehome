/**
 * Core type definitions for the 4x4 Tic-Tac-Toe game.
 * Defines the primitives like players, board structure, and coordinates.
 */
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Row = readonly [Cell, Cell, Cell, Cell];
export type Board = readonly [Row, Row, Row, Row];
export type Coordinate = readonly [row: 0 | 1 | 2 | 3, col: 0 | 1 | 2 | 3];
export type WinLine = readonly Coordinate[];

export const BOARD_SIZE = 4;
