import { Player } from "./player";

export type ChessManKind =
  | "Pawn"
  | "Rook"
  | "Knight"
  | "Bishop"
  | "Queen"
  | "King";

const chessManChars = {
  Pawn: "♟",
  Rook: "♜",
  Knight: "♞",
  Bishop: "♝",
  Queen: "♛",
  King: "♚",
};

const chessManInitial = {
  White: {
    Pawn: "P",
    Rook: "R",
    Knight: "N",
    Bishop: "B",
    Queen: "Q",
    King: "K",
  },
  Black: {
    Pawn: "p",
    Rook: "r",
    Knight: "n",
    Bishop: "b",
    Queen: "q",
    King: "k",
  },
};

export class ChessMan {
  kind: ChessManKind;
  constructor(kind: ChessManKind) {
    this.kind = kind;
  }
  toUnicodeChar() {
    return chessManChars[this.kind];
  }
  toInitial(player: Player) {
    return chessManInitial[player][this.kind];
  }
}
