import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInTrigger } from '../../share/animations/animations';
import { Observable, Subscription, interval } from 'rxjs';
import { ScheduleSubject } from '../../models/schedule-subject.model';
import { IonSlides } from '@ionic/angular';
import { Store } from '../../share/store.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from './schedule.service';
import { tap, delay } from 'rxjs/operators';
import { Schedule } from '../../models/schedule.model';

@Component({
    selector: 'app-schedule-detail',
    templateUrl: './schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
    animations: [fadeInTrigger]
})
export class SchedulePage implements OnInit {
    title = 'スケジュール';
    studentId: number;
    now = new Date();
    date = this.now.getDate();
    year = this.now.getFullYear();
    month = this.now.getMonth();

    selectedDate: number = this.date;
    selectedMonth: number = this.month;
    selectedYear: number = this.year;
    listOfDays = ['日', '月', '火', '水', '木', '金', '土'];
    listOfMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    daysInMonth: { date: number; day: string }[] = [];
    schedules$: Observable<Schedule[]>;
    loading = true;
    checkActiveTime = 2 * 60 * 1000;
    checkActiveSub: Subscription;

    @ViewChild('daySlides', { static: false }) daySlides: IonSlides;
    @ViewChild('monthSlides', { static: false }) monthSlides: IonSlides;

    constructor(private store: Store, private route: ActivatedRoute, private scheduleService: ScheduleService) {}
    monthSlideOpts = {
        slidesPerView: 'auto'
    };

    daySlideOpts = {
        slidesPerView: 'auto'
    };

    ngOnInit() {
        this.schedules$ = this.scheduleService.schedules$;
    }

    ionViewWillEnter() {
        this.studentId = this.route.snapshot.params['id'];
        this.getDaysInMonth(this.selectedMonth, this.selectedYear);
        this.setDaySlides();
        this.setMonthSlides();
        this.scheduleService
            .fetchSubjects(this.selectedDate, this.listOfMonths[this.selectedMonth], this.selectedYear)
            .pipe(
                tap(() => (this.loading = true)),
                delay(1000)
            )
            .subscribe(
                res => (this.loading = false),
                err => (this.loading = false)
            );
    }

    onSlideChange(e) {}

    getDaysInMonth(month, year) {
        this.daysInMonth = [];
        const numberOfDays = new Date(year, month + 1, 0).getDate();
        const firstDayInMonth = new Date(year, month, 1).getDay();
        for (let i = 0; i < numberOfDays; i++) {
            this.daysInMonth.push({ date: i + 1, day: this.listOfDays[(firstDayInMonth + i) % 7] });
        }
    }

    onSelectDay(date: number) {
        this.loading = true;
        this.selectedDate = date;
        this.scheduleService
            .fetchSubjects(this.selectedDate, this.listOfMonths[this.selectedMonth], this.selectedYear)
            .subscribe(res => (this.loading = false));
    }

    setMonthSlides() {
        this.monthSlides.slideTo(this.selectedMonth);
        this.monthSlides.lockSwipes(true);
    }

    setDaySlides() {
        // this.daySlides.slideTo(this.selectedDate);
        const index = this.daysInMonth.findIndex(day => day.date == this.selectedDate);
        this.daySlides.slideTo(index);
    }

    prevMonth() {
        if (this.selectedMonth > 0) {
            this.selectedMonth--;
        } else {
            this.selectedYear--;
            this.selectedMonth = 11;
        }
        this.monthSlides.lockSwipes(false);
        this.monthSlides.slideTo(this.selectedMonth);
        this.monthSlides.lockSwipes(true);
    }

    nextMonth() {
        if (this.selectedMonth < 11) {
            this.selectedMonth++;
        } else {
            this.selectedYear++;
            this.selectedMonth = 0;
        }
        this.monthSlides.lockSwipes(false);
        this.monthSlides.slideTo(this.selectedMonth);
        this.monthSlides.lockSwipes(true);
    }

    onMonthChange(type) {
        type === 'prev' ? this.prevMonth() : this.nextMonth();
        this.selectedDate = -1;
        this.getDaysInMonth(this.selectedMonth, this.selectedYear);
        this.daySlides.slideTo(0);
    }

    checkActive(timeStart, timeEnd) {
        timeStart = timeStart.split(':');
        timeEnd = timeEnd.split(':');
        const dateTimeStart = new Date(
            this.selectedYear,
            this.selectedMonth,
            this.selectedDate,
            timeStart[0],
            timeStart[1]
        ).getTime();
        const dateTimeEnd = new Date(
            this.selectedYear,
            this.selectedMonth,
            this.selectedDate,
            timeEnd[0],
            timeEnd[1]
        ).getTime();
        const now = new Date().getTime();
        if (now >= dateTimeStart && now <= dateTimeEnd) {
            return true;
        }
        return false;
    }

    formatDate(time) {
        time = time.split(':');
        const hour = +time[0] > 12 ? +time[0] - 12 : +time[0];
        const amPm = +time[0] > 12 ? 'pm' : 'am';
        return `${hour}:${time[1]} ${amPm}`;
    }

    decodeEntities(str) {
        // this prevents any overhead from creating the object each time
        let element = document.createElement('div');

        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }
}
