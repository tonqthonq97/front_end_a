import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AppService } from 'src/app/app.service';

export interface HttpReqOptions {
    body?: any;
    params?: HttpParams;
    headers?: HttpHeaders;
}

@Injectable()
export class HttpService {
    constructor(private http: HttpClient, private router: Router, private appService: AppService) {}

    send(method: string, url: string, config: HttpReqOptions): Observable<any> {
        let params = new HttpParams();
        if (config.params) {
            for (const key of Object.keys(config.params)) {
                params = params.append(key, config.params[key]);
            }
        }

        const reqOptions: HttpReqOptions = {
            body: config.body,
            headers: config.headers,
            params
        };

        return this.http.request<any>(method.toLowerCase(), url, reqOptions).pipe(
            map(res => {
                return this.httpSuccess(res);
            }),
            catchError(error => {
                return this.httpError(error);
            })
        );
    }

    private httpSuccess(res: Response): Observable<any> {
        const body: any = res || { message: 'Request sent successfully but no data loaded' };
        return of(res);
    }

    private httpError(error: any) {
        //  this.router.navigate(['/login']);
        return of(error);
    }
}
