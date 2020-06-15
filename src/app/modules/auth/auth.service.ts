import { Observable, of, throwError, BehaviorSubject, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap, switchMap, take, catchError, map, concatMap, first, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../models/auth-response.model';
import { Store } from '../share/store.service';
import { ResData } from '../models/res-data.model';
import { FULL_ROUTES } from '../share/router-names';
import { NotificationsService } from '../main/notifications/notifications.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
    authResponse = of({
        idToken: '1asdf234',
        localId: 2,
        email: 'chaunguyen@gmail.com',
        expiresIn: 3600
    });
    user = new BehaviorSubject<User>(null);
    userId: number;
    tokenExpirationTimer: any;

    constructor(
        private store: Store,
        private router: Router,
        private http: HttpClient,
        private notificationService: NotificationsService,
        private fcm: FCM,
        private platform: Platform
    ) {}
    login(email: string, password: string) {
        let resDataClone;
        email = email.toLowerCase();
        return this.http
            .post<AuthResponseData>(`${environment.APIUrls.login}`, { email, password })
            .pipe(
                first(),
                catchError(error => {
                    const errorMessage = 'エラーが発生しました。';
                    this.store.alertSubject.next(errorMessage);
                    return throwError(errorMessage);
                }),
                concatMap(resData => {
                    resDataClone = resData;
                    try {
                        return this.getFcmToken(resDataClone);
                    } catch (error) {
                        return of(null);
                    }
                }),
                tap(fbToken => {
                    this.handleResponse(resDataClone, email, fbToken);
                }),
                concatMap(() => {
                    return this.postUserDetail();
                }),
                mergeMap(() => {
                    return this.loadParent(resDataClone);
                })
            );
    }

    autoLogin(): Observable<boolean> {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            const user = new User(userData.email, userData.id, userData._token, userData.device, userData.fbToken);

            this.user.next(user);
            return this.store.fetchParentData(user.id).pipe(map(parent => (parent.id ? true : false)));
        } else {
            return of(false);
        }
    }

    logout() {
        this.notificationService.clearNotifications();
        const userData = JSON.parse(localStorage.getItem('userData'));
        localStorage.removeItem('userData');
        this.user.next(null);
        this.router.navigate([FULL_ROUTES.AUTH]);
        return this.http.put<ResData>(`${environment.APIUrls.saveUser}/${userData.id}`, {
            device: null,
            fbToken: null
        });
    }

    autoLogout(expirationDuration: number) {
        // millisecond
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: number, token: string, fbToken: string) {
        let device;
        if (this.platform.is('ios')) {
            device = 'ios';
        } else if (this.platform.is('android')) {
            device = 'android';
        } else {
            device = undefined;
        }
        const user = new User(email, userId, token, device, fbToken);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private getFcmToken(resData: AuthResponseData) {
        if (resData.code === 200) {
            if (this.platform.is('android')) {
                return from(this.fcm.getToken());
            } else if (this.platform.is('ios')) {
                return from(this.fcm.getToken());
            } else {
                return of(undefined);
            }
        } else {
            return of(undefined);
        }
    }

    private handleAuthError(errorRes: AuthResponseData) {
        let errorMessage = 'エラーが発生しました。!';
        if (!errorRes.message || !errorRes.code) {
            return throwError(errorMessage);
        } else {
            errorMessage = errorRes.message;
        }

        this.store.alertSubject.next(errorMessage);
    }

    private handleResponse(resData: AuthResponseData, email: string, fbToken: string) {
        if (resData.code === 200) {
            this.handleAuthentication(email, +resData.localId, resData.token, fbToken);
        } else {
            this.handleAuthError(resData);
        }
    }

    private loadParent(resData: AuthResponseData) {
        if (resData.code === 200) {
            return this.store.fetchParentData(+resData.localId).pipe(first());
        } else {
            return of('login error');
        }
    }

    postUserDetail() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return this.http
            .put<ResData>(`${environment.APIUrls.saveUser}/${userData.id}`, {
                device: userData.device,
                fbToken: userData.fbToken
            })
            .pipe(
                catchError(error => {
                    return of('Device is undefined');
                })
            );
    }

    getUserId() {
        return this.userId;
    }

    forgetPassword(email) {
        return this.http.post<ResData>(`${environment.APIUrls.forgetPassword}`, { email });
    }
}
