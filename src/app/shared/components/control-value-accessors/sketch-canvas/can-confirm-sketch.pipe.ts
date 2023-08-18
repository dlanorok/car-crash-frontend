import { inject, Pipe, PipeTransform } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { Sketch } from "@app/shared/components/control-value-accessors/sketch-canvas/sketch-canvas.component";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Pipe({
  name: 'canConfirmSketch',
})
export class CanConfirmSketchPipe implements PipeTransform {
  private readonly cookieService: CookieService = inject(CookieService);

  transform(sketch: Sketch | null | undefined): boolean {
    if (!sketch) {
      return false;
    }

    return !sketch.confirmedEditors.includes(this.cookieService.get(CookieName.sessionId)) && (!sketch.editing || sketch.editor === this.cookieService.get(CookieName.sessionId));
  }
}
