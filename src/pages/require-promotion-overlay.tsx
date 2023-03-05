import { ChessMan, ChessManKind } from "./api/chess-man";
import { GameState } from "./api/game-state";
import { FontFamily, ChessManDiv } from "./api/styles";

export function RequirePromotionOverlay(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  fontFamily: FontFamily
) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        flexDirection: "column",
        userSelect: "none",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      }}>
      <p
        style={{
          fontFamily,
          fontSize: "20px",
          width: "300px",
          height: "30px",
          color: "white",
          stroke: "black",
          strokeWidth: "10px",
          textAlign: "center",
        }}>
        Select a piece to promote to:
      </p>
      <p
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {(["Rook", "Bishop", "Knight", "Queen"] as ChessManKind[]).map(
            man => (
              <button
                key={`promotion-button-${man}`}
                style={{
                  fontFamily,
                  fontSize: "40px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: gameState.turn.player,
                  WebkitTextStroke:
                    gameState.turn.player === "Black" ? "0.1px" : "0.8px",
                }}
                onClick={() => {
                  gameState.promote(man);
                  setGameState(gameState.clone());
                }}>
                <ChessManDiv
                  theme={{
                    cellKind: "Light",
                    player: gameState.turn.player,
                    isSelected: "Unselected",
                    isValid: "Valid",
                    fontFamily,
                  }}>
                  {new ChessMan(man).toUnicodeChar()}
                </ChessManDiv>
              </button>
            )
          )}
        </span>
      </p>
    </div>
  );
}
