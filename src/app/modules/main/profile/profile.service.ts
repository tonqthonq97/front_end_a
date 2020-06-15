import { Injectable } from '@angular/core';
import { Store } from '../../share/store.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResData } from '../../models/res-data.model';
import { first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(private http: HttpClient, private store: Store) {}
    changePassword(old_password: string, new_password: string, confirm_password: string) {
        return this.store.parent$.pipe(
            first(),
            switchMap(parent => {
                return this.http.put<ResData>(`${environment.APIUrls.changePassword}/${parent.id}`, {
                    old_password,
                    new_password,
                    confirm_password
                });
            })
        );
    }
}
