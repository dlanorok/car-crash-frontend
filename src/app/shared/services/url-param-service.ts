import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UrlParamService {
  saveUrlParamToLocalStorage(storageName: string, paramName: string) {
    const path = window.location.pathname;
    const paramIndex = path.indexOf(`${paramName}/`);

    if (paramIndex !== -1) {
      const start = paramIndex + paramName.length + 1;
      const end = path.indexOf('/', start);
      const paramValue = end === -1 ? path.slice(start) : path.slice(start, end);
      localStorage.setItem(storageName, paramValue);
    }
  }
}

