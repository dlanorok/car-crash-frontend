import { ColorPalette } from "@app/shared/color-scheme/models/color-palette";
import { Color } from "@app/shared/color-scheme/models/color";

export const defaultColorScheme = new ColorPalette({
  primary: new Color({ base: '#29908d'}),
  dark: new Color({ base: '#0b726e'}),
  light: new Color({ base: '#cef3f2'}),
  background: new Color({ base: '#e9e9e9'}),
  strokes: new Color({ base: '#d8d8d8'}),
  type: new Color({ base: '#273131'}),
  basic: new Color({ base: '#ffffff'}),
});
