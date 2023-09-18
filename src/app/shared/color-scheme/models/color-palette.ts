import { ColorType } from '../interfaces/color-type';
import { Color } from './color';
import { EssentialColorData } from "@app/shared/color-scheme/interfaces/essential-color-data";

export class ColorPalette implements Record<ColorType, Color> {
  primary!: Color;
  dark!: Color;
  light!: Color;
  background!: Color;
  strokes!: Color;
  type!: Color;
  basic!: Color;

  constructor(data: Record<ColorType, EssentialColorData>) {
    Object.assign(this, data);
  }
}
