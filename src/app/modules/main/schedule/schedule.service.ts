import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResData } from '../../models/res-data.model';
import { environment } from 'src/environments/environment';
import { map, tap, first } from 'rxjs/operators';
import { ScheduleSubject } from '../../models/schedule-subject.model';
import { Store } from '../../share/store.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Schedule } from '../../models/schedule.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
    private scheduleSubject = new BehaviorSubject<Schedule[]>(null);
    schedules$: Observable<Schedule[]> = this.scheduleSubject.asObservable();

    constructor(private http: HttpClient, private store: Store) {}
    fetchSubjects(date, month, year): Observable<Schedule[]> {
        const params = new HttpParams()
            .set('date', String(date || ''))
            .set('month', String(month || ''))
            .set('year', String(year || ''));

        return this.http
            .get<ResData>(`${environment.APIUrls.schedule}`, { params })
            .pipe(
                map(resData => resData.data),
                map((schedules: Schedule[]) => {
                    return schedules.sort((a, b) => a.group_id - b.group_id);
                }),
                tap((schedules: Schedule[]) => {
                    this.scheduleSubject.next(schedules);
                })
            );
    }
}
