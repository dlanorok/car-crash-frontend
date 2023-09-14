import { createThemeColorPaletteCssVariablesFactory } from './create-theme-color-palette-css-variables-factory';
import { THEME_COLOR_PREFIX } from "@app/shared/color-scheme/constants/css-color-variable-prefix";
import { ColorPalette } from "@app/shared/color-scheme/models/color-palette";
import { css } from "@app/shared/color-scheme/helpers/lit-css";

export const createCssColorPalette = createThemeColorPaletteCssVariablesFactory(THEME_COLOR_PREFIX);

export const createEssentialThemeStyles = (palette: ColorPalette): string => {
  const styles = css`
    :root {
      ${createCssColorPalette(palette)}
    }
  `;

  return (
    styles
      // remove all white space characters (excluding spaces)
      .replace(/[\r\n\t\f\v]/g, '')
      // replace multiple spaces with single one
      .replace(/\s+/g, ' ')
  );
};
