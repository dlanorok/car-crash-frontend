import { AllColorData } from '../interfaces/all-color-data';
import { TinyColor } from "@ctrl/tinycolor";
import { isColorDark } from "@app/shared/color-scheme/helpers/is-color-dark";
import { RgbColorValues } from "@app/shared/color-scheme/interfaces/rgb-color-values";
import { getRgbValues } from "@app/shared/color-scheme/helpers/get-rgb-values";
import { EssentialColorData } from "@app/shared/color-scheme/interfaces/essential-color-data";

export class Color implements AllColorData {
  base!: string;
  baseTinyColor!: TinyColor;

  constructor(data: EssentialColorData) {
    Object.assign(this, data);
    this.baseTinyColor = new TinyColor(this.base);
  }

  get isDark(): boolean {
    return isColorDark(this.baseTinyColor);
  }

  get shade(): string {
    return this.baseTinyColor.shade(10).toHexString();
  }

  get tint(): string {
    return this.baseTinyColor.tint(12).toHexString();
  }

  get lightBase(): string {
    return this.baseTinyColor.tint(80).toHexString();
  }

  get translucentBase(): string {
    return this.baseTinyColor.tint(90).toHexString();
  }

  get lightContrast(): string {
    return this.baseTinyColor.shade(90).toHexString();
  }

  get highlight(): string {
    return (this.isDark ? this.baseTinyColor.tint(20) : this.baseTinyColor.shade(20)).toHexString();
  }

  get baseHex(): string {
    return this.baseTinyColor.toHexString();
  }

  get baseRgb(): string {
    return this.baseTinyColor.toRgbString();
  }

  get baseRgbValues(): RgbColorValues {
    return getRgbValues(this.baseTinyColor);
  }

}

export class DarkThemeColor extends Color {
  override get lightBase(): string {
    return this.baseTinyColor.shade(65).toHexString();
  }

  override get lightContrast(): string {
    return this.baseTinyColor.tint(10).toHexString();
  }
}
