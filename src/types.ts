export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Row = readonly Cell[];
export type Board = readonly Row[];
export type Coordinate = readonly [row: number, col: number];
export type WinLine = readonly Coordinate[];

export const BOARD_SIZE = 4;
