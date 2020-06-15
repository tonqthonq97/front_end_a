import { Injectable, OnInit } from '@angular/core';
import { map, tap, take, first, withLatestFrom, delay, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Parent } from '../models/parent.model';
import { ResData } from '../models/res-data.model';
import { UserLevel } from '../models/userlevel.model';
import { Notification } from '../models/notification.model';
import { Student } from '../models/student.model';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class Store {
    private amountOfNewNotificationsSubject = new BehaviorSubject<number>(null);
    private parentSubject = new BehaviorSubject<Parent>(null);
    private studentSubject = new BehaviorSubject<Student[]>([]);
    private searchbarSubject = new BehaviorSubject<string>('');
    private titleSubject = new BehaviorSubject('');
    private boxShadowHeaderSubject = new BehaviorSubject(true);
    private backBtnSubject = new BehaviorSubject(true);
    private tabsSubject = new Subject<string>();
    private absenceFormBackRedirect = new BehaviorSubject<string>(null);
    private loadingSubject = new Subject<boolean>();

    absenceFormBackRedirectUrl$ = this.absenceFormBackRedirect.asObservable();
    amountNewNotifications$ = this.amountOfNewNotificationsSubject.asObservable();
    backFromAbsence = new BehaviorSubject<boolean>(null);
    clearSearchbarValue = new Subject<void>();
    alertSubject = new Subject<string>();
    isLoadingStudents = new Subject<boolean>();
    parent$: Observable<Parent> = this.parentSubject.asObservable();
    students$: Observable<Student[]> = this.studentSubject.asObservable();
    titleSub$: Observable<string> = this.titleSubject.asObservable();
    boxShadowHeaderSubject$: Observable<boolean> = this.boxShadowHeaderSubject.asObservable();
    backBtn$: Observable<boolean> = this.backBtnSubject.asObservable();
    tabs$: Observable<string> = this.tabsSubject.asObservable();
    searchbar$: Observable<string> = this.searchbarSubject.asObservable();
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor(private http: HttpClient, private loadingCtrl: LoadingController) {}

    fetchParentData(userId: number) {
        return this.http.get<ResData>(`${environment.APIUrls.parent}/${userId}`).pipe(
            map(resData => {
                const parentData = resData.data[0];
                this.parentSubject.next(parentData);
                parentData.id = userId;
                return parentData;
            }),
            tap((parent: Parent) => {
                this.studentSubject.next(parent.students);
            })
        );
    }

    refreshParent() {
        this.isLoadingStudents.next(true);
        const parentValue = this.parentSubject.value;
        this.fetchParentData(parentValue.id)
            .pipe(
                first(),
                finalize(() => this.isLoadingStudents.next(false))
            )
            .subscribe();
    }

    getUserPositionByLevel(level: number): string {
        return UserLevel[level - 1];
    }

    inputChanged(search: string) {
        this.searchbarSubject.next(search);
    }

    goToTab(tab: string) {
        this.tabsSubject.next(tab);
    }

    handleError(err = null) {
        this.loadingSubject.next(false);
        if (!err) {
            this.alertSubject.next('エラーが発生しました。');
        } else {
            this.alertSubject.next(err);
        }
    }

    setAmountNotifications(amount: number) {
        this.amountOfNewNotificationsSubject.next(amount);
    }

    clearParent() {
        this.parentSubject.next(null);
    }

    setAbsenceFormRedirectUrl(url: string) {
        this.absenceFormBackRedirect.next(url);
    }

    isLoading(state) {
        this.loadingSubject.next(state);
    }
}
