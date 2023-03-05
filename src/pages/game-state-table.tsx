import { GameState } from "./api/game-state";
import { FontFamily } from "./api/styles";
import { Tuple8 } from "./api/table8x8";
import { SelectedCell } from "./api/selected-cell";
import { Cell } from "./cell";

function GameStateTableCells(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  selectedCell: SelectedCell,
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>,
  fontFamily: FontFamily
): Tuple8<Tuple8<JSX.Element>> {
  return gameState.board
    .map((cell, coord) =>
      Cell(
        gameState,
        setGameState,
        selectedCell,
        setSelectedCell,
        fontFamily,
        coord,
        cell
      )
    )
    .destruct();
}

export function GameStateTable(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  selectedCell: SelectedCell,
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell>>,
  fontFamily: FontFamily
) {
  const cells = GameStateTableCells(
    gameState,
    setGameState,
    selectedCell,
    setSelectedCell,
    fontFamily
  );
  const rows = cells.map((row, r) => (
    <tr key={`rank-${r}`}>
      <td
        style={{
          width: "40px",
          height: "40px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <div>{8 - r}</div>
      </td>
      {row.map((cell, c) => (
        <td key={`cell-${r}-${c}`}>{cell}</td>
      ))}
    </tr>
  ));
  return (
    <table
      style={{
        position: "absolute",
      }}>
      <tbody>
        <tr
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}>
          <td></td>
          {cells[0].map((cell, c) => (
            <td
              key={`file-index-${c}`}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {String.fromCharCode(97 + c)}
            </td>
          ))}
        </tr>
        {rows}
      </tbody>
    </table>
  );
}
