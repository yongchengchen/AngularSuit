import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS} from '@angular/common/http';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('HttpAuthInterceptor OVERWRITE REQUEST', req)
    let authReq = req.clone({headers: req.headers.set('Authorization', this.retrieveAuthToken())});
    return next.handle(authReq);
  }
  private retrieveAuthToken(): string {
      let value = localStorage.getItem("authToken");
      if (!value) {
        value = '';
      }
      return value; 
    }
}

export const HTTPCLIENT_AUTH_PLUGIN = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpAuthInterceptor,
    multi: true,
}