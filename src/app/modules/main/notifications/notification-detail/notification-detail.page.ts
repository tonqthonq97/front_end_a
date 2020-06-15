import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/modules/models/notification.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, concatMap } from 'rxjs/operators';
import { NotificationsService } from '../notifications.service';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.page.html',
    styleUrls: ['./notification-detail.page.scss']
})
export class NotificationDetailPage implements OnInit {
    title = '通知';
    backUrl = FULL_ROUTES.NOTIFICATIONS;

    notification$: Observable<Notification>;
    notiId: number;

    SURVEY = {
        NORMAL: 1,
        URGENT: 2
    };
    constructor(
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private store: Store
    ) {}

    ngOnInit() {}
    ionViewWillEnter() {
        this.notiId = +this.route.snapshot.params['id'];
        if (this.notiId) {
            this.notification$ = this.notificationsService.getNotificationDetail(this.notiId);
            this.notificationsService.markReadNotification(this.notiId).subscribe();
        } else {
            this.router.navigate([FULL_ROUTES.HOME]);
        }
    }

    goToSurvey(id, type, start, end) {
        if (type === this.SURVEY.NORMAL) {
            this.router.navigate([FULL_ROUTES.SURVEYS, id]);
        } else {
            const now = new Date();
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (now > startDate && now < endDate) {
                this.router.navigate([FULL_ROUTES.SURVEYS, id]);
            } else {
                this.store.alertSubject.next('このアンケートは現在利用できません。');
            }
        }
    }
}
