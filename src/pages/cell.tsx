import { CellState, GameState } from "./api/game-state";
import { CellButton, FontFamily, ChessManDiv } from "./api/styles";
import { Coordinate } from "./api/table8x8";
import { SelectedCell } from "./api/selected-cell";

function CellInterior(
  selectedCell: SelectedCell,
  fontFamily: FontFamily,
  coord: Coordinate,
  promotionCoord: Coordinate | "None",
  cell: CellState,
  isValid: "Valid" | "Invalid"
) {
  const { r, c } = coord;
  return (
    <CellButton
      style={{ marginLeft: "auto" }}
      theme={{
        cellKind: (r + c) % 2 === 0 ? "Dark" : "Light",
        player: cell === "Empty" ? "Empty" : cell.player,
        isSelected:
          selectedCell !== "None" &&
          selectedCell.coord.r === r &&
          selectedCell.coord.c === c
            ? "Selected"
            : "Unselected",
        isValid: isValid,
        fontFamily,
      }}>
      <ChessManDiv
        theme={{
          cellKind: (r + c) % 2 === 0 ? "Dark" : "Light",
          player: cell === "Empty" ? "Empty" : cell.player,
          isSelected:
            selectedCell !== "None" &&
            selectedCell.coord.r === r &&
            selectedCell.coord.c === c
              ? "Selected"
              : "Unselected",
          isValid: isValid,
          fontFamily,
        }}>
        {cell === "Empty"
          ? " "
          : promotionCoord !== "None" && coord === promotionCoord
          ? "?"
          : cell.man.toUnicodeChar()}
      </ChessManDiv>
    </CellButton>
  );
}

export function Cell(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  selectedCell: SelectedCell,
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>,
  fontFamily: FontFamily,
  coord: Coordinate,
  cell: CellState
) {
  const isValid =
    selectedCell === "None" ||
    gameState.tryMove(selectedCell.coord, coord) !== "Invalid"
      ? "Valid"
      : "Invalid";
  return (
    <div
      style={{ display: "flex" }}
      onClick={() => {
        if (selectedCell === "None") {
          if (cell !== "Empty") {
            if (cell.player === gameState.turn.player) {
              setSelectedCell({
                man: cell.man,
                coord,
              });
            }
            setGameState(gameState.clone());
          }
        } else {
          if (selectedCell.coord === coord) {
            setSelectedCell("None");
          } else {
            const newState = gameState.tryMove(selectedCell.coord, coord);
            if (newState !== "Invalid") {
              newState.updateStatus();
              setGameState(newState);
            }
            setSelectedCell("None");
          }
        }
      }}>
      {CellInterior(
        selectedCell,
        fontFamily,
        coord,
        gameState.promotionCoord,
        cell,
        isValid
      )}
    </div>
  );
}
