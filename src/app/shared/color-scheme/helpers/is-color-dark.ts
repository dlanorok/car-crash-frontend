import { TinyColor } from '@ctrl/tinycolor';

export const isColorDark = (color: string | TinyColor): boolean =>
  (color instanceof TinyColor ? color : new TinyColor(color)).getLuminance() < 0.15;
