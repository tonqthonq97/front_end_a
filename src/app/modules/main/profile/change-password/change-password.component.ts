import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/modules/share/store.service';
import { NgForm } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { format } from 'url';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    title = 'パスワードを変更します';
    backUrl = FULL_ROUTES.PROFILE;

    constructor(
        private store: Store,
        private profileService: ProfileService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {}
    onSubmit(f: NgForm) {
        if (f.valid) {
            const value = f.value;
            if (value['new-password'] !== value['confirm-password']) {
                this.store.alertSubject.next('パスワードと確認用パスワードが一致しません。');
            } else {
                this.store.isLoading(true);
                this.profileService
                    .changePassword(value['old-password'], value['new-password'], value['confirm-password'])
                    .subscribe(
                        res => {
                            this.store.isLoading(false);
                            if (res.code === 200) {
                                this.store.alertSubject.next(res.message);
                                this.router.navigate([FULL_ROUTES.PROFILE]);
                                f.reset();
                            } else {
                                this.store.alertSubject.next(res.message);
                            }
                        },
                        err => {
                            this.store.handleError();
                        }
                    );
            }
        }
    }
}
