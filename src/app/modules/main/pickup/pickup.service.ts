import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Store } from '../../share/store.service';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PickupService {
    constructor(private http: HttpClient, private authService: AuthService, private store: Store) {}

    submitPickupRequest(studentId: number, busName: string, form: NgForm) {
        if (form.valid) {
            return this.http.post<any>(environment.APIUrls.pickup, {
                plate: busName,
                student_id: studentId,
                date_start: form.value.dateStart.substring(0, 10),
                date_end: form.value.dateEnd.substring(0, 10),
                to_flg: form.value.morning,
                back_flg: form.value.afternoon
            });
        } else {
            return of();
        }
    }
}
