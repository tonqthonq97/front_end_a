import { Injectable, OnInit } from '@angular/core';
import { ResData } from '../../models/res-data.model';
import { environment } from 'src/environments/environment';
import { map, tap, exhaustMap, first, concatMap, retryWhen, delay, repeatWhen, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { Store } from '../../share/store.service';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { FULL_ROUTES } from '../../share/router-names';

@Injectable({ providedIn: 'root' })
export class NotificationsService implements OnInit {
    private notificationSubject = new BehaviorSubject<Notification[]>([]);
    notifications$: Observable<Notification[]> = this.notificationSubject.asObservable();
    amountOfNewNotiSubject: Subject<number> = new Subject();

    fetchLimit = 10;
    currentFetchIndex = 0;
    delayFetchNotifications = 15000; // ms
    delayBetweenDisplayNotifications = 3000;
    afterFirstLoading = true;
    amountOfNewNotifications = 0;

    constructor(
        private store: Store,
        private http: HttpClient,
        private toastController: ToastController,
        private location: Location
    ) {}

    ngOnInit() {}
    fetchNotifications(loadMore = true, toEnd = true): Observable<any> {
        let loadedNotifications: Notification[];
        let faqParams = new HttpParams();
        faqParams = faqParams.set('limit', String(this.fetchLimit));
        faqParams = faqParams.set('offset', String(this.currentFetchIndex));

        return this.store.parent$.pipe(
            first(),
            switchMap(parent => {
                return this.http
                    .get<ResData>(`${environment.APIUrls.notifications}/${parent.id}`, {
                        params: faqParams
                    })
                    .pipe(
                        first(),
                        map(resData => {
                            loadedNotifications = resData.data;
                            return resData.data;
                        }),
                        concatMap(notifications => {
                            if (notifications.length !== 0) {
                                this.setNotifications(notifications, loadMore, toEnd);
                                this.currentFetchIndex += this.fetchLimit;
                                return this.markNewestNotification();
                            } else {
                                return of([]);
                            }
                        }),
                        map(() => loadedNotifications)
                    );
            })
        );
    }

    // New --> last tracked
    fetchNewNotification(): Observable<Notification[]> {
        return this.store.parent$.pipe(
            first(),
            switchMap(parent => {
                return this.http
                    .get<ResData>(`${environment.APIUrls.newNotifications}/${parent.id}`)
                    .pipe(map(resData => resData.data));
            })
        );
    }

    // Track newest notification

    markNewestNotification() {
        const notifications = this.notificationSubject.value;
        if (notifications.length !== 0) {
            return this.http
                .put(`${environment.APIUrls.markNewestNotification}/${notifications[0].id}`, {})
                .pipe(first());
        } else {
            return of();
        }
    }

    markReadNotification(notiId) {
        this.notifications$.pipe(first()).subscribe(notifications => {
            const newList = notifications.map(el => {
                if (el.id === notiId) {
                    el.read = 1;
                }
                return el;
            });
            this.setNotifications(newList, false, false);
        });
        return this.http.put(`${environment.APIUrls.markReadNotification}/${notiId}`, {});
    }

    fetchIndexIncreases(num) {
        this.currentFetchIndex += num;
    }

    setNotifications(notifications, loadMore: boolean, toEnd: boolean) {
        if (loadMore) {
            const oldNotifications = this.notificationSubject.getValue();

            if (toEnd) {
                this.notificationSubject.next([...oldNotifications, ...notifications]);
            } else {
                this.notificationSubject.next([...notifications, ...oldNotifications]);
            }
        } else {
            this.notificationSubject.next([...notifications]);
        }
    }

    showNotifications(arr) {
        for (let i = 0; i < arr.length; i++) {
            setTimeout(() => {
                const message = arr[arr.length - 1 - i].title;
                this.toastController
                    .create({
                        color: 'primary',
                        duration: this.delayBetweenDisplayNotifications - 1000,
                        message: message.length >= 20 ? message.substring(0, 20) + '...' : message,
                        showCloseButton: true,
                        position: 'top'
                    })
                    .then(toast => {
                        toast.present();
                    });
            }, this.delayBetweenDisplayNotifications * i);
        }
    }

    listenNewNotifications() {
        return this.fetchNewNotification().pipe(
            retryWhen(error$ => {
                return error$.pipe(delay(this.delayFetchNotifications));
            }),
            concatMap((notifications: Notification[]) => {
                return this.handleNewNotifications(notifications);
            }),
            repeatWhen(completed => {
                return completed.pipe(delay(this.delayFetchNotifications));
            })
        );
    }

    handleNewNotifications(notifications: Notification[]): any {
        if (notifications.length !== 0 && notifications.length > this.amountOfNewNotifications) {
            const newNotifications = notifications.slice(0, notifications.length - this.amountOfNewNotifications);
            if (!this.afterFirstLoading) {
                this.showNotifications(newNotifications);
            }
            this.afterFirstLoading = false;
            this.setNotifications(newNotifications, true, false);
            this.fetchIndexIncreases(newNotifications.length);
            if (this.location.path() === FULL_ROUTES.NOTIFICATIONS) {
                this.amountOfNewNotifications = 0;
                this.store.setAmountNotifications(this.amountOfNewNotifications);
                return this.markNewestNotification();
            } else {
                this.amountOfNewNotifications = notifications.length;
                this.store.setAmountNotifications(this.amountOfNewNotifications);
                return of();
            }
        } else {
            this.afterFirstLoading = false;
            return of();
        }
    }

    getNotificationDetail(notiId: number) {
        return this.notifications$.pipe(map(notifications => notifications.find(el => el.id === notiId)));
    }

    clearNotifications() {
        this.currentFetchIndex = 0;
        this.afterFirstLoading = true;
        this.notificationSubject.next([]);
    }
}
