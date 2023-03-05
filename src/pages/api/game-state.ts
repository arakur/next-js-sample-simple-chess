import { Table8x8, Coordinate, Col, Row, ToChessCoordinate } from "./table8x8";
import { Player } from "./player";
import { ChessManKind, ChessMan } from "./chess-man";
import { Move } from "./move";

import { cloneDeep } from "lodash";

export type GameStatus =
  | "White"
  | "Black"
  | "Draw"
  | "Continue"
  | "RequirePromotion";

export class Turn {
  player: Player;
  constructor() {
    this.player = "White";
  }
  changed(): Player {
    return this.player === "White" ? "Black" : "White";
  }
  change() {
    this.player = this.changed();
  }
}

export type CellState = { man: ChessMan; player: Player } | "Empty";

export class GameState {
  board: Table8x8<CellState>;
  turn: Turn;
  enPassantCoord: Coordinate | "None";
  promotionCoord: Coordinate | "None";
  canCastle: {
    White: { KingSide: boolean; QueenSide: boolean };
    Black: { KingSide: boolean; QueenSide: boolean };
  };
  status: GameStatus;
  count: number;
  fiftyMoveCount: number;
  constructor() {
    this.board = Table8x8.fill("Empty");
    this.turn = new Turn();
    this.enPassantCoord = "None";
    this.promotionCoord = "None";
    this.canCastle = {
      White: { KingSide: true, QueenSide: true },
      Black: { KingSide: true, QueenSide: true },
    };
    this.status = "Continue";
    this.count = 1;
    this.fiftyMoveCount = 0;
    // initialize men
    for (let i = 0; i < 8; i++) {
      let c = i as Col;
      this.board.set(
        { r: 1, c },
        { man: new ChessMan("Pawn"), player: "Black" }
      );
      this.board.set(
        { r: 6, c },
        { man: new ChessMan("Pawn"), player: "White" }
      );
    }
    const pieces: ChessManKind[] = [
      "Rook",
      "Knight",
      "Bishop",
      "Queen",
      "King",
      "Bishop",
      "Knight",
      "Rook",
    ];
    for (let i = 0; i < 8; i++) {
      let c = i as Col;
      const piece = pieces[c];
      this.board.set(
        { r: 0, c },
        { man: new ChessMan(piece), player: "Black" }
      );
      this.board.set(
        { r: 7, c },
        { man: new ChessMan(piece), player: "White" }
      );
    }
  }

  clone(): GameState {
    return cloneDeep(this);
  }

  emptyDurRow(coord0: Coordinate, c1: Col): boolean {
    return this.board.allDurInnerRow(val => val === "Empty", coord0, c1);
  }

  emptyDurCol(coord0: Coordinate, r1: Row): boolean {
    return this.board.allDurInnerCol(val => val === "Empty", coord0, r1);
  }

  emptyDurDownDiag(coord0: Coordinate, coord1: Coordinate): boolean {
    return this.board.allDurInnerDownDiag(
      val => val === "Empty",
      coord0,
      coord1
    );
  }

  emptyDurUpDiag(coord0: Coordinate, coord1: Coordinate): boolean {
    return this.board.allDurInnerUpDiag(val => val === "Empty", coord0, coord1);
  }

  move(move: Move): void {
    const { r, c } = move.to;
    const player = this.turn.player;
    const cellState = this.board.get(move.from);
    const rAdv1 = player === "White" ? 1 : -1;
    if (cellState === "Empty") {
      throw new Error("oops!");
    }
    const man = cellState.man;
    const taken = this.board.get(move.to);
    switch (move.kind) {
      case "Normal":
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        this.enPassantCoord = "None";
        this.promotionCoord = "None";
        if (man.kind === "King") {
          this.canCastle[player].KingSide = false;
          this.canCastle[player].QueenSide = false;
        }
        if (man.kind === "Rook") {
          if (c === 0) {
            this.canCastle[player].QueenSide = false;
          }
          if (c === 7) {
            this.canCastle[player].KingSide = false;
          }
        }
        break;
      case "PawnTwoAdvance":
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        const emPassantR = (r + rAdv1) as Row;
        this.enPassantCoord = {
          r: emPassantR,
          c: c,
        };
        this.promotionCoord = "None";
        break;
      case "EnPassant":
        if (this.enPassantCoord === "None") {
          throw new Error("oops!");
        }
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        const originalChessManR = (this.enPassantCoord.r + rAdv1) as Row;
        this.board.set(
          {
            r: originalChessManR,
            c: this.enPassantCoord.c,
          },
          "Empty"
        );
        this.enPassantCoord = "None";
        this.promotionCoord = "None";
        break;
      case "Promotion":
        console.log("PROMOTION");
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        this.enPassantCoord = "None";
        this.promotionCoord = move.to;
        this.status = "RequirePromotion";
        break;
      case "KingSideCastle":
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        const rookK = this.board.get({
          r,
          c: (c + 1) as Col,
        });
        this.board.set(
          {
            r,
            c: (c + 1) as Col,
          },
          "Empty"
        );
        this.board.set(
          {
            r,
            c: (c - 1) as Col,
          },
          rookK
        );
        this.enPassantCoord = "None";
        this.promotionCoord = "None";
        this.canCastle[player] = {
          KingSide: false,
          QueenSide: false,
        };
        break;
      case "QueenSideCastle":
        this.board.set(move.to, {
          man,
          player,
        });
        this.board.set(move.from, "Empty");
        const rookQ = this.board.get({
          r,
          c: (c - 2) as Col,
        });
        this.board.set(
          {
            r,
            c: (c - 2) as Col,
          },
          "Empty"
        );
        this.board.set(
          {
            r,
            c: (c + 1) as Col,
          },
          rookQ
        );
        this.enPassantCoord = "None";
        this.promotionCoord = "None";
        this.canCastle[player] = {
          KingSide: false,
          QueenSide: false,
        };
        break;
    }
    if (man.kind === "Pawn" || taken !== "Empty") {
      this.fiftyMoveCount = 0;
    } else {
      this.fiftyMoveCount += 1;
    }
    if (this.turn.player === "Black") this.count += 1;
    this.turn.change();
  }

  isAttackedFrom(from: Coordinate, to: Coordinate, player: Player): boolean {
    const fromCellState = this.board.get(from);
    const toCellState = this.board.get(to);
    if (fromCellState === "Empty" || fromCellState.player === player)
      return false;
    if (toCellState !== "Empty" && toCellState.player !== player) return false;
    const man = fromCellState.man;

    if (from === to) return false;
    const moveX = to.c - from.c;
    const moveY = player === "White" ? to.r - from.r : from.r - to.r;

    switch (man.kind) {
      case "Pawn":
        return moveY === 1 && (moveX === -1 || moveX === 1);
      case "Rook":
        if (moveX === 0) {
          return this.emptyDurCol(from, to.r);
        } else if (moveY === 0) {
          return this.emptyDurRow(from, to.c);
        } else {
          return false;
        }
      case "Knight":
        return (
          (Math.abs(moveX) === 1 && Math.abs(moveY) === 2) ||
          (Math.abs(moveX) === 2 && Math.abs(moveY) === 1)
        );
      case "Bishop":
        if (from.r - to.r === from.c - to.c) {
          return this.emptyDurDownDiag(from, to);
        } else if (from.r - to.r === to.c - from.c) {
          return this.emptyDurUpDiag(from, to);
        } else {
          return false;
        }
      case "Queen":
        if (moveX === 0) {
          return this.emptyDurCol(from, to.r);
        } else if (moveY === 0) {
          return this.emptyDurRow(from, to.c);
        } else if (from.r - to.r === from.c - to.c) {
          return this.emptyDurDownDiag(from, to);
        } else if (from.r - to.r === to.c - from.c) {
          return this.emptyDurUpDiag(from, to);
        } else {
          return false;
        }
      case "King":
        return Math.abs(moveX) <= 1 && Math.abs(moveY) <= 1;
    }
  }

  isAttacked(to: Coordinate, player: Player): boolean {
    return !this.board.all((_, from) => !this.isAttackedFrom(from, to, player));
  }

  isChecked(player: Player): boolean {
    for (let i = 0; i < 8; i++) {
      const r = i as Row;
      for (let j = 0; j < 8; j++) {
        const c = j as Col;
        const cellState = this.board.get({ r, c });
        if (
          cellState !== "Empty" &&
          cellState.man.kind === "King" &&
          cellState.player === player
        ) {
          return this.isAttacked({ r, c }, player);
        }
      }
    }
    throw new Error("King not found");
  }

  isMated(player: Player): "Checkmate" | "Stalemate" | "Not Mated" {
    const mated = this.board.all((_, from) =>
      this.board.all((_, to) => this.tryMove(from, to) === "Invalid")
    );
    if (mated) {
      return this.isChecked(player) ? "Checkmate" : "Stalemate";
    }
    return "Not Mated";
  }

  checkValidMoveExceptAttacked(
    from: Coordinate,
    to: Coordinate
  ): Move | "Invalid" {
    const turn = this.turn;
    const fromCellState = this.board.get(from);
    const toCellState = this.board.get(to);
    if (fromCellState === "Empty" || fromCellState.player !== turn.player)
      return "Invalid";
    if (toCellState !== "Empty" && toCellState.player === turn.player)
      return "Invalid";
    const man = fromCellState.man;

    if (from === to) return "Invalid";
    const moveX = to.c - from.c;
    const moveY = turn.player === "White" ? from.r - to.r : to.r - from.r;

    switch (man.kind) {
      case "Pawn":
        if (moveX === 0) {
          if (toCellState !== "Empty") {
            return "Invalid";
          } else if (
            this.isInitialPawnRow(from.r) &&
            moveY === 2 &&
            this.emptyDurCol(from, to.r)
          ) {
            return {
              kind: "PawnTwoAdvance",
              from: from,
              to: to,
            };
          } else if (moveY === 1) {
            if (to.r === 0 || to.r === 7) {
              console.log("from", from);
              console.log("to", to);
            }
            if (to.r === 0 || to.r === 7) {
              return {
                kind: "Promotion",
                from: from,
                to: to,
              };
            } else {
              return {
                kind: "Normal",
                from: from,
                to: to,
              };
            }
          } else return "Invalid";
        } else if (moveY === 1 && (moveX === -1 || moveX === 1)) {
          if (
            this.enPassantCoord !== "None" &&
            to.r === this.enPassantCoord.r &&
            to.c === this.enPassantCoord.c
          ) {
            return {
              kind: "EnPassant",
              from: from,
              to: to,
            };
          } else if (toCellState !== "Empty") {
            if (to.r === 0 || to.r === 7) {
              return {
                kind: "Promotion",
                from: from,
                to: to,
              };
            } else {
              return {
                kind: "Normal",
                from: from,
                to: to,
              };
            }
          } else {
            return "Invalid";
          }
        } else {
          return "Invalid";
        }
      case "Rook":
        if (moveX === 0 && this.emptyDurCol(from, to.r)) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (moveY === 0 && this.emptyDurRow(from, to.c)) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else {
          return "Invalid";
        }
      case "Knight":
        if (
          (Math.abs(moveX) === 1 && Math.abs(moveY) === 2) ||
          (Math.abs(moveX) === 2 && Math.abs(moveY) === 1)
        ) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else {
          return "Invalid";
        }
      case "Bishop":
        if (
          from.r - to.r === from.c - to.c &&
          this.emptyDurDownDiag(from, to)
        ) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (
          from.r - to.r === to.c - from.c &&
          this.emptyDurUpDiag(from, to)
        ) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else {
          return "Invalid";
        }
      case "Queen":
        if (moveX === 0 && this.emptyDurCol(from, to.r)) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (moveY === 0 && this.emptyDurRow(from, to.c)) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (
          from.r - to.r === from.c - to.c &&
          this.emptyDurDownDiag(from, to)
        ) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (
          from.r - to.r === to.c - from.c &&
          this.emptyDurUpDiag(from, to)
        ) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else {
          return "Invalid";
        }
      case "King":
        if (Math.abs(moveX) <= 1 && Math.abs(moveY) <= 1) {
          return {
            kind: "Normal",
            from: from,
            to: to,
          };
        } else if (
          this.canCastle[turn.player]["KingSide"] &&
          moveX === 2 &&
          moveY === 0
        ) {
          for (let i = 5; i < 7; i++) {
            if (this.board.get({ r: from.r, c: i as Col }) !== "Empty")
              return "Invalid";
          }
          for (let i = 4; i < 7; i++) {
            if (this.isAttacked({ r: from.r, c: i as Col }, turn.player))
              return "Invalid";
          }
          return {
            kind: "KingSideCastle",
            from: from,
            to: to,
          };
        } else if (
          this.canCastle[turn.player]["QueenSide"] &&
          moveX === -2 &&
          moveY === 0
        ) {
          for (let i = 1; i < 4; i++) {
            if (this.board.get({ r: from.r, c: i as Col }) !== "Empty")
              return "Invalid";
          }
          for (let i = 2; i < 5; i++) {
            if (this.isAttacked({ r: from.r, c: i as Col }, turn.player))
              return "Invalid";
          }
          return {
            kind: "QueenSideCastle",
            from: from,
            to: to,
          };
        } else {
          return "Invalid";
        }
    }
  }

  tryMove(from: Coordinate, to: Coordinate): GameState | "Invalid" {
    const move = this.checkValidMoveExceptAttacked(from, to);
    if (move === "Invalid") return "Invalid";
    let newState = this.clone();
    newState.move(move);
    if (newState.isChecked(this.turn.player)) return "Invalid";
    if (newState.status === "RequirePromotion") {
      newState.turn.change();
      console.log(newState.turn.player);
    }
    return newState;
  }

  promote(promoteTo: ChessManKind): void {
    console.log(this.turn.player);
    if (this.status !== "RequirePromotion" || this.promotionCoord === "None")
      throw new Error("Cannot promote when not required");

    this.board.set(this.promotionCoord, {
      man: new ChessMan(promoteTo),
      player: this.turn.player,
    });
    this.status = "Continue";
    this.turn.change();
    this.updateStatus();
  }

  updateStatus(): void {
    if (this.status === "RequirePromotion") return;
    switch (this.isMated(this.turn.player)) {
      case "Checkmate":
        this.status = this.turn.changed();
        break;
      case "Stalemate":
        this.status = "Draw";
        break;
      case "Not Mated":
        break;
    }
  }

  isInitialPawnRow(r: Row): boolean {
    switch (this.turn.player) {
      case "White":
        return r === 6;
      case "Black":
        return r === 1;
    }
  }

  getFEN(): string {
    let ret = "";
    for (let i = 0; i < 8; i++) {
      const r = i as Row;
      let emptyCount = 0;
      for (let j = 0; j < 8; j++) {
        const c = j as Col;
        const coord = { r, c };
        const cell = this.board.get(coord);
        if (cell === "Empty") {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            ret += emptyCount.toString();
          }
          ret += cell.man.toInitial(cell.player);
          emptyCount = 0;
        }
      }
      if (emptyCount > 0) {
        ret += emptyCount.toString();
      }
      if (i !== 7) {
        ret += "/";
      }
    }
    ret += " ";
    ret += this.turn.player === "White" ? "w" : "b";
    ret += " ";
    let canCastle = false;
    if (this.canCastle["White"]["KingSide"]) {
      ret += "K";
      canCastle = true;
    }
    if (this.canCastle["White"]["QueenSide"]) {
      ret += "Q";
      canCastle = true;
    }
    if (this.canCastle["Black"]["KingSide"]) {
      ret += "k";
      canCastle = true;
    }
    if (this.canCastle["Black"]["QueenSide"]) {
      ret += "q";
      canCastle = true;
    }
    if (!canCastle) {
      ret += "-";
    }
    ret += " ";
    if (this.enPassantCoord === "None") {
      ret += "-";
    } else {
      ret += ToChessCoordinate(this.enPassantCoord);
    }
    ret += " ";
    ret += this.fiftyMoveCount.toString();
    ret += " ";
    ret += this.count.toString();
    return ret;
  }
}
