import { Coordinate } from "./table8x8";

type MoveKind =
  | "Normal"
  | "PawnTwoAdvance"
  | "EnPassant"
  | "Promotion"
  | "KingSideCastle"
  | "QueenSideCastle"
  | "EnPassant";

export type Move = {
  kind: MoveKind;
  from: Coordinate;
  to: Coordinate;
};
