import { inject, Pipe, PipeTransform } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";

@Pipe({
  name: 'amICreator',
})
export class AmICreatorPipe implements PipeTransform {
  private readonly cookieService: CookieService = inject(CookieService);

  transform(creator: string | boolean | undefined): boolean {
    if (!creator) {
      return false;
    }
    return creator === this.cookieService.get(CookieName.sessionId);
  }
}
