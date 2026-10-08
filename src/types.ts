export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Row = readonly [Cell, Cell, Cell, Cell];
export type Board = readonly [Row, Row, Row, Row];
export type Coordinate = readonly [row: number, col: number];
export type WinLine = readonly [Coordinate, Coordinate, Coordinate, Coordinate];

export const BOARD_SIZE = 4;
export const PLAYERS: readonly Player[] = Object.freeze(['X', 'O']);
