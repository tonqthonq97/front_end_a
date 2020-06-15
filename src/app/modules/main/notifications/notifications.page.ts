import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from './notifications.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Store } from '../../share/store.service';
import { FULL_ROUTES } from '../../share/router-names';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit {
    title = '通知';
    notifications$: Observable<Notification[]>;

    isLoading: boolean;
    disableScroll = false;
    parentId: number;
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    constructor(private store: Store, private notificationsService: NotificationsService, private router: Router) {}

    ngOnInit() {
        this.isLoading = true;
        this.notifications$ = this.notificationsService.notifications$;
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.setUpNotifications();
    }

    loadMoreData(event) {
        this.notificationsService
            .fetchNotifications()
            .pipe(
                tap((notifications: Notification[]) => {
                    if (notifications.length !== 0) {
                        if (event) {
                            event.target.complete();
                        }
                    } else {
                        this.disableScroll = true;
                    }
                })
            )
            .subscribe();
    }

    onClick(id: number) {
        this.router.navigate([FULL_ROUTES.NOTIFICATIONS, id]);
    }

    setUpNotifications() {
        this.notificationsService.amountOfNewNotifications = 0;
        this.store.setAmountNotifications(0);
        this.notificationsService.fetchNotifications().subscribe(
            res => {
                this.isLoading = false;
            },
            err => {
                this.isLoading = false;
                this.store.handleError(err);
            }
        );
    }

    getTime(time: string) {
        const timeDate = new Date(time);
        if (this.isToday(timeDate)) {
            let hour: string | number = timeDate.getHours();
            hour = hour > 9 ? hour : '0' + hour;
            let minute: string | number = timeDate.getMinutes();
            minute = minute > 9 ? minute : '0' + minute;
            return `${hour}:${minute}`;
        } else if (this.isInWeek(timeDate)) {
            return this.days[timeDate.getDay()];
        } else {
            return `${timeDate.getDate()} ${this.months[timeDate.getMonth()]}`;
        }
    }

    isToday(someDate: Date) {
        const today = new Date();
        return (
            someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
        );
    }

    isInWeek(someDate: Date) {
        const today = new Date();
        const sameDayLastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return someDate > sameDayLastWeek;
    }
}
