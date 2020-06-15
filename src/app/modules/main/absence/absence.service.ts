import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/auth.service';
import { first, tap, switchMap } from 'rxjs/operators';
import { Store } from '../../share/store.service';
import { of } from 'rxjs';
import { ResData } from '../../models/res-data.model';

@Injectable({ providedIn: 'root' })
export class AbsenceService implements OnInit {
    studentId: number;
    constructor(private http: HttpClient, private authService: AuthService, private store: Store) {}
    ngOnInit() {}

    submitAbsenceRequest(teacherId: number, studentId: number, form: NgForm) {
        if (form.valid) {
            return this.store.parent$.pipe(
                first(),
                switchMap(parent => {
                    return this.http.post<ResData>(environment.APIUrls.absence, {
                        user_id: teacherId,
                        parent_id: parent.id,
                        student_id: studentId,
                        date_start: form.value.dateStart.substring(0, 10),
                        date_end: form.value.dateEnd.substring(0, 10),
                        reason: form.value.message
                    });
                })
            );
        } else {
            return of();
        }
    }
}
