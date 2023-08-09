import { inject, Pipe, PipeTransform } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { CrashModel } from "@app/shared/models/crash.model";

@Pipe({
  name: 'amICreator',
})
export class AmICreatorPipe implements PipeTransform {
  private readonly cookieService: CookieService = inject(CookieService);

  transform(crash: CrashModel |  null): boolean {
    if (!crash) {
      return false;
    }
    return crash.creator === this.cookieService.get(CookieName.sessionId);
  }
}
