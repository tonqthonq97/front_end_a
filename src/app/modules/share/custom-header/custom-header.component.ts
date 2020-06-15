import { Input, Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FULL_ROUTES } from '../router-names';
import { Store } from '../store.service';
import { Router } from '@angular/router';
import { MainService } from '../../main/main.service';
import { NotificationsService } from '../../main/notifications/notifications.service';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-custom-header',
    templateUrl: './custom-header.component.html',
    styleUrls: ['./custom-header.component.scss']
})
export class CustomHeader implements OnInit, OnDestroy {
    @Input() title = '';
    @Input() shadowOff = false;
    @Input() backBtn = true;
    @Input() defaultHref: string = FULL_ROUTES.HOME;
    @Input() backUrl: string;
    @Input() dismissModal: boolean;
    newNotificationSub: Subscription;
    amountOfNotificationSub: Subscription;
    fetchNotiTime = 1;
    notificationAmount: number;
    isBarsSetHeight = false;
    isAndroid: boolean;

    constructor(
        private store: Store,
        private location: Location,
        private router: Router,
        private mainService: MainService,
        private notificationsService: NotificationsService,
        private renderer: Renderer2,
        private platform: Platform,
        private navCtrl: NavController,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.isAndroid = this.platform.is('android') ? true : false;
        // Get new notifications and show alerts
        this.store.amountNewNotifications$.subscribe(amount => (this.notificationAmount = amount));
    }

    ngOnDestroy() {}

    ionViewDidEnter() {}

    redirectBack() {
        if (this.backBtn) {
            console.log('redirect back');
            if (this.dismissModal) {
                this.modalCtrl.dismiss();
            } else {
                this.navCtrl.back();
            }
        }
    }

    onBellClick() {
        this.router.navigate([FULL_ROUTES.NOTIFICATIONS]);
    }

    ionViewWillLeave() {
        this.amountOfNotificationSub.unsubscribe();
        this.newNotificationSub.unsubscribe();
    }
}
