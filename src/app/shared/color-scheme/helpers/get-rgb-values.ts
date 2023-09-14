import { TinyColor } from '@ctrl/tinycolor';
import { RgbColorValues } from '../interfaces/rgb-color-values';

export const getRgbValues = (tinyColor: TinyColor): RgbColorValues => {
  const rgbValues = tinyColor.toRgb();
  return `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`;
};
