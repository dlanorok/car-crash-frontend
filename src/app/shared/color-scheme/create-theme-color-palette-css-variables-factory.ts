import { ColorPalette } from "@app/shared/color-scheme/models/color-palette";
import { ColorType } from "@app/shared/color-scheme/interfaces/color-type";
import { Color } from "@app/shared/color-scheme/models/color";
import { css } from "@app/shared/color-scheme/helpers/lit-css";

export const createThemeColorPaletteCssVariablesFactory =
  (prefix: string) =>
  (colorPalette: ColorPalette): string =>
    Object.entries(colorPalette)
      .map(([colorType, color]: [string, any]): [ColorType, Color] => [colorType as ColorType, color])
      .map(
        ([colorType, color]) =>
          css`
          --${prefix}-${colorType}: ${color.baseHex};
          --${prefix}-${colorType}-rgb: ${color.baseRgbValues};
          --${prefix}-${colorType}-shade: ${color.shade};
          --${prefix}-${colorType}-tint: ${color.tint};
          --${prefix}-${colorType}-highlight: ${color.highlight};
          --${prefix}-${colorType}-light-base: ${color.lightBase};
          --${prefix}-${colorType}-translucent-base: ${color.translucentBase};
          --${prefix}-${colorType}-light-contrast: ${color.lightContrast};
    `,
      )
      .reduce((completeStyles, colorStyles) => `${completeStyles}${colorStyles}`, '')
      // remove all white space characters (excluding spaces)
      .replace(/[\r\n\t\f\v]/g, '')
      // replace multiple spaces with single one
      .replace(/\s+/g, ' ');
