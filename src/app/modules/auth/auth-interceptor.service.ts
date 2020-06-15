import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, concatMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authSv: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authSv.user.pipe(
            take(1),
            concatMap((user: User) => {
                let reqClone;
                if (!request.url.includes('http')) {
                    let newUrlRequest = `${environment.APIEndpoint}/${request.url}`;
                    reqClone = request.clone({
                        url: newUrlRequest,
                        setHeaders: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*',
                            Authorization: user ? user.token : ''
                        }
                    });
                } else {
                    reqClone = request.clone({
                        url: request.url,
                        setHeaders: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }

                return next.handle(reqClone);
            })
        );
    }
}
