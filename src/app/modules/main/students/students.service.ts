import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../models/student.model';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { tap, map, first, switchMap } from 'rxjs/operators';
import { Store } from '../../share/store.service';
import { Parent } from '../../models/parent.model';
import { environment } from 'src/environments/environment';
import { ResData } from '../../models/res-data.model';
import { AbsenceReport } from '../../models/absenceReport.model';
import { NgForm } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class StudentsService {
    private studentSubject = new BehaviorSubject<Student>(null);
    private absenceReport = new BehaviorSubject<AbsenceReport[]>([]);

    student$: Observable<Student> = this.studentSubject.asObservable();
    absenceRp$: Observable<AbsenceReport[]> = this.absenceReport.asObservable();

    constructor(private store: Store, private http: HttpClient) {}

    getStudentDetail(studentId: number) {
        return this.store.parent$.pipe(
            first(),
            map((parent: Parent) => parent.students.find((student: Student) => student.id === studentId)),
            tap((student: Student) => this.studentSubject.next(student))
        );
    }

    getAbsenceHistory(studentId: number): Observable<AbsenceReport[]> {
        return this.http.get<ResData>(`${environment.APIUrls.absenceHistory}/${studentId}`).pipe(
            map(resData => (resData.code === 200 ? resData.data : [])),
            tap(report => this.absenceReport.next(report))
        );
    }
}
