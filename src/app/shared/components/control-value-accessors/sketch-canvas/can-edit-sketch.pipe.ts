import { inject, Pipe, PipeTransform } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { Sketch } from "@app/shared/components/control-value-accessors/sketch-canvas/sketch-canvas.component";

@Pipe({
  name: 'canEditSketch',
})
export class CanEditSketchPipe implements PipeTransform {
  private readonly cookieService: CookieService = inject(CookieService);

  transform(sketch: Sketch | null | undefined): boolean {
    if (!sketch) {
      return false;
    }

    return !sketch.editing;
  }
}
