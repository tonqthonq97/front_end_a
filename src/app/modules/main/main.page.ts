import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit, AfterViewInit, Renderer2 } from '@angular/core';
import { MainService } from './main.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, repeatWhen, delay, map, concatMap, retry, retryWhen, first } from 'rxjs/operators';
import { Observable, interval, timer, of, Subscription, from, merge } from 'rxjs';
import { NotificationsService } from './notifications/notifications.service';
import { Notification } from '../models/notification.model';
import { ToastController, Platform, NavController, IonHeader, IonTabs } from '@ionic/angular';
import { ResData } from '../models/res-data.model';
import { Store } from '../share/store.service';
import { Card } from '../models/card.model';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from '../auth/auth.service';
import { FULL_ROUTES } from '../share/router-names';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss']
})
export class MainPage implements OnInit, OnDestroy {
    @ViewChild(IonHeader, { static: false }) header: IonHeader;
    newNotificationSub: Subscription;
    amountOfNotificationSub: Subscription;
    headerShadowOn$: Observable<boolean>;
    backBtn$: Observable<boolean>;
    title$: Observable<string>;
    fetchNotiTime = 1;
    amountOfNewNotifications = 0;
    footerItems: Card[];
    isBarsSetHeight = false;
    isAndroid: boolean;
    fcmSetup: Subscription;

    constructor(
        private store: Store,
        private location: Location,
        private router: Router,
        private mainService: MainService,
        private notificationsService: NotificationsService,
        private renderer: Renderer2,
        private platform: Platform,
        private notificationService: NotificationsService,
        private fcm: FCM,
        private toastCtrl: ToastController,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.footerItems = this.mainService.getFooterItems();

        // Get new notifications and show alerts
        this.newNotificationSub = this.notificationsService.listenNewNotifications().subscribe();
        if (this.platform.is('mobile')) {
            try {
                this.fcmSetup = merge(this.refreshFcmToken(), this.handleFcm()).subscribe();
            } catch (error) {}
        }
    }

    ngOnDestroy() {
        if (this.fcmSetup) {
            this.fcmSetup.unsubscribe();
        }
        // alert('destroy');
    }

    ionViewWillLeave() {
        this.newNotificationSub.unsubscribe();
    }

    private async presentToast(message, title) {
        title = title ? title : 'School GPS';
        const toast = await this.toastCtrl.create({
            message: `<b>${title}</b><br>${message}`,
            duration: 5000,
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'View'
        });
        toast.present();
        toast.onDidDismiss().then(res => this.router.navigate([FULL_ROUTES.NOTIFICATIONS]));
    }

    private refreshFcmToken() {
        return this.fcm.onTokenRefresh();
    }

    private handleFcm() {
        return this.fcm.onNotification().pipe(
            tap(res => {
                if (this.platform.is('ios')) {
                    this.presentToast(res.aps.body, res.title);
                } else if (this.platform.is('android')) {
                    this.presentToast(res.body, res.title);
                }
            })
        );
    }
}
