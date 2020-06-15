import {
    CanActivate,
    ActivatedRouteSnapshot,
    Router,
    UrlTree,
    RouterStateSnapshot,
    CanLoad,
    Route,
    UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { FULL_ROUTES } from '../share/router-names';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService, private router: Router) {}
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.user.asObservable().pipe(
            take(1),
            switchMap(user => {
                // alert('guard');
                if (!user) {
                    return this.authService.autoLogin();
                } else {
                    return of(true);
                }
            }),
            tap(isLoggedIn => {
                if (!isLoggedIn) {
                    this.router.navigateByUrl(FULL_ROUTES.AUTH);
                }
            })
        );
    }
}
