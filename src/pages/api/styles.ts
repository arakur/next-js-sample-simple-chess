import { Player } from "./player";
import { CellKind, IsSelected, IsValid } from "./ui-types";
import styled from "styled-components";

export const Fonts = ["Times", "DejaVu Sans", "Pecita"] as const;
export type FontFamily = typeof Fonts[number];

const fontSize = 40;

const CellBorderColorDict = {
  Selected: "Orange",
  Unselected: "DarkSlateBlue",
};

const CellBorderColorHOverDict = {
  Selected: "DarkKhaki",
  Unselected: "CornflowerBlue",
};

const CellColorDict = {
  Dark: {
    Valid: {
      Selected: "Gold",
      Unselected: "Peru",
    },
    Invalid: {
      Selected: "Gold",
      Unselected: "Gray",
    },
  },
  Light: {
    Valid: {
      Selected: "Gold",
      Unselected: "Beige",
    },
    Invalid: {
      Selected: "Gold",
      Unselected: "LightGray",
    },
  },
};

const CellColorHOverDict = {
  Dark: {
    Valid: "BurlyWood",
    Invalid: "Gainsboro",
  },
  Light: {
    Valid: "PaleGoldenRod",
    Invalid: "Azure",
  },
};

const ChessManColorDict = {
  Black: "Black",
  White: "White",
};

const ChessManBorderColorDict = {
  Dark: {
    Black: "LightGrey",
    White: "Black",
  },
  Light: {
    Black: "LightGrey",
    White: "Black",
  },
};

export const ChessManDiv = styled.div`
  font-family: ${(props: { theme: { fontFamily: FontFamily } }) =>
    props.theme.fontFamily};
  font-size: ${fontSize}px;
  -webkit-text-stroke: ${(props: { theme: { player: Player | "Empty" } }) =>
      props.theme.player === "Empty"
        ? "0px"
        : props.theme.player === "Black"
        ? "0.1px"
        : "0.8px"}
    ${(props: { theme: { player: Player | "Empty"; cellKind: CellKind } }) =>
      props.theme.player === "Empty"
        ? "#00000000"
        : ChessManBorderColorDict[props.theme.cellKind][props.theme.player]};
  color: ${(props: { theme: { player: Player | "Empty" } }) =>
    props.theme.player === "Empty"
      ? "#00000000"
      : ChessManColorDict[props.theme.player]};
`;

export const CellButton = styled.button`
  border: ${(props: { theme: { isSelected: IsSelected } }) =>
      props.theme.isSelected === "Selected" ? "4px" : "2px"}
    solid
    ${(props: { theme: { isSelected: IsSelected } }) =>
      CellBorderColorDict[props.theme.isSelected]};
  background: ${(props: {
    theme: { isSelected: IsSelected; cellKind: CellKind; isValid: IsValid };
  }) =>
    CellColorDict[props.theme.cellKind][props.theme.isValid][
      props.theme.isSelected
    ]};
  color: ${(props: { theme: { player: Player | "Empty" } }) =>
    props.theme.player === "Empty"
      ? "#00000000"
      : ChessManColorDict[props.theme.player]};
  -webkit-text-stroke: ${(props: { theme: { player: Player | "Empty" } }) =>
      props.theme.player === "Empty"
        ? "0px"
        : props.theme.player === "Black"
        ? "0.1px"
        : "0.8px"}
    ${(props: { theme: { player: Player | "Empty"; cellKind: CellKind } }) =>
      props.theme.player === "Empty"
        ? "#00000000"
        : ChessManBorderColorDict[props.theme.cellKind][props.theme.player]};
  font-family: ${(props: { theme: { fontFamily: FontFamily } }) =>
    props.theme.fontFamily};
  font-size: ${fontSize}px;
  margin: 0px;
  width: ${fontSize}px;
  height: ${fontSize}px;
  padding: 0px 0px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: ${(props: { theme: { isSelected: IsSelected } }) =>
        props.theme.isSelected === "Selected" ? "4px" : "2px"}
      solid
      ${(props: { theme: { isSelected: IsSelected } }) =>
        CellBorderColorHOverDict[props.theme.isSelected]};
    background: ${(props: {
      theme: { cellKind: CellKind; isValid: IsValid };
    }) => CellColorHOverDict[props.theme.cellKind][props.theme.isValid]};
  }
`;
