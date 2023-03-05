import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { GameState, GameStatus } from "./api/game-state";
import { Player } from "./api/player";
import { Fonts, FontFamily } from "./api/styles";
import { SelectedCell } from "./api/selected-cell";
import { GameStateTable } from "./game-state-table";
import { RequirePromotionOverlay } from "./require-promotion-overlay";

function statusString(status: GameStatus, player: Player) {
  switch (status) {
    case "Continue":
      return player === "White" ? "White's turn" : "Black's turn";
    case "White":
      return "White wins";
    case "Black":
      return "Black wins";
    case "Draw":
      return "Draw";
    case "RequirePromotion":
      return "requiring promotion";
  }
}

function getAnalysis(gameState: GameState) {
  const url = "/api";
}

export default function App() {
  const [gameState, setGameState] = useState(new GameState());
  const [selectedCell, setSelectedCell] = useState<SelectedCell>("None");
  const [fontFamily, setFontFamily] = useState("Times" as FontFamily);
  const [analysis, setAnalysis] = useState(null);

  const [analysisCache, setAnalysisCache] = useState(new Map());

  useEffect(() => {
    let fen = gameState.getFEN();
    if (analysisCache.has(fen)) {
      console.log("cache hit");
      setAnalysis(analysisCache.get(fen));
    } else {
      fetch(
        `https://www.chessdb.cn/cdb.php?action=queryall&board=${fen}&json=1`,
        { method: "GET" }
      )
        .then(res => res.json())
        .then(data => {
          console.log("fetch data status:" + data["status"]);
          setAnalysis(data);
          if (data["status"] !== "unknown") {
            setAnalysisCache(analysisCache.set(fen, data));
          }
        })
        .catch(err => {
          console.log(err);
          console.log("err");
        });
    }
  }, [gameState, analysisCache]);

  return (
    <div>
      <p>
        <span>Pieces Font: &nbsp;</span>
        <select
          onChange={e => {
            setFontFamily(e.target.value as FontFamily);
          }}
          value={fontFamily}
          style={{
            fontFamily,
            fontSize: "20px",
            width: "300px",
            height: "30px",
          }}>
          {Fonts.map(font => (
            <option
              key={"piece-font-option-" + font}
              value={font}
              style={{
                fontFamily: font,
              }}>
              ♞ {font}
            </option>
          ))}
        </select>
      </p>

      <div
        style={{
          position: "relative",
          backgroundColor: "#EEEEEE",
          width: "400px",
          height: "400px",
        }}>
        {GameStateTable(
          gameState,
          setGameState,
          selectedCell,
          setSelectedCell,
          fontFamily
        )}
        {gameState.status === "RequirePromotion" ? (
          RequirePromotionOverlay(gameState, setGameState, fontFamily)
        ) : (
          <></>
        )}
      </div>
      <p>{statusString(gameState.status, gameState.turn.player)}</p>
      <p>
        Evaluation: &nbsp;
        {analysis === null
          ? "loading"
          : analysis["status"] === "ok"
          ? `${
              analysis["moves"][0]["score"] *
              (gameState.turn.player === "White" ? 1 : -1)
            }`
          : analysis["status"] === "unknown"
          ? "unknown failure"
          : "-"}
      </p>
      <p>
        A recommended move: &nbsp;
        {analysis === null
          ? "loading"
          : analysis["status"] === "ok"
          ? `${analysis["moves"][0]["san"]}`
          : analysis["status"] === "unknown"
          ? "unknown failure"
          : "-"}
      </p>
    </div>
  );
}
