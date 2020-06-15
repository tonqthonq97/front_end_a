import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, Config, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from './modules/auth/auth.service';
import { showTrigger } from './modules/share/animations/animations';
import { Store } from './modules/share/store.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { simpleTransitionAnimation } from './modules/share/routing-transition/simple.transition';
import { first, switchMap, tap, concatMap, finalize, mergeMap } from 'rxjs/operators';
import { from, Subscription, of } from 'rxjs';
import { FULL_ROUTES } from './modules/share/router-names';
import { Badge } from '@ionic-native/badge/ngx';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    animations: [showTrigger]
})
export class AppComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    error: string = null;
    backSub: Subscription;
    badgeSubscription: Subscription;

    constructor(
        private platform: Platform,
        private authService: AuthService,
        private store: Store,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private config: Config,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private badge: Badge
    ) {
        this.initializeApp();
    }

    ngOnInit() {
        this.platform.backButton
            .pipe(
                finalize(() => {
                    this.navCtrl.navigateBack(FULL_ROUTES.HOME);
                })
            )
            .subscribe();

        this.backSub = this.platform.backButton.subscribeWithPriority(9999, () => {
            this.navCtrl.navigateBack(FULL_ROUTES.HOME);
        });

        this.store.alertSubject.subscribe((res: string) => {
            this.error = res;
        });

        this.store.loading$
            .pipe(
                tap(state => (this.isLoading = state)),
                mergeMap(state => {
                    if (state) {
                        return from(this.loadingCtrl.create());
                    } else {
                        return from(this.loadingCtrl.dismiss());
                    }
                }),
                tap((el: any) => {
                    if (this.isLoading) {
                        el.present();
                    }
                })
            )
            .subscribe((res: boolean) => {});

        // this.badgeSubscription = from(this.badge.hasPermission()).pipe(concatMap(hasPermission => hasPermission ? this.store.amountNewNotifications$ : of()), tap((amount: number) => {
        //     alert('new notification')
        //     if (amount != 0) {
        //         this.badge.set(+amount)
        //     } else {
        //         this.badge.clear()
        //     }
        // })).subscribe()

        // this.badgeSubscription = this.store.amountNewNotifications$.pipe(tap((amount: number) => {
        //     alert('new notification')
        //     if (amount != 0) {
        //         this.badge.set(+amount)
        //     } else {
        //         this.badge.clear()
        //     }
        // })).subscribe()
    }

    ngOnDestroy() {
        if (this.badgeSubscription) {
            this.badgeSubscription.unsubscribe();
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    onCloseAlert() {
        this.error = null;
    }
}
