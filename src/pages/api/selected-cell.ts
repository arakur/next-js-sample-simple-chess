import { ChessMan } from "./chess-man";
import { Coordinate } from "./table8x8";

export type SelectedCell = { man: ChessMan; coord: Coordinate } | "None";
