import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '../../share/store.service';
import { Router } from '@angular/router';
import { FULL_ROUTES } from '../../share/router-names';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-forgot-pwd',
    templateUrl: './forgot-pwd.component.html',
    styleUrls: ['../auth.page.scss']
})
export class ForgotPwdComponent implements AfterViewInit {
    @ViewChild('authForm', { static: false }) authForm: NgForm;
    constructor(
        private authService: AuthService,
        private store: Store,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {}

    ngAfterViewInit() {
        this.authForm.reset();
    }

    onForgetPassword(f: NgForm) {
        if (f.valid) {
            // this.store.loadingSubject.next(true);
            this.store.isLoading(true);
            this.authService.forgetPassword(f.value.email).subscribe(
                res => {
                    // this.store.loadingSubject.next(false);
                    this.store.isLoading(false);
                    if (res.code === 200) {
                        this.store.alertSubject.next(res.message);
                        this.router.navigate([FULL_ROUTES.AUTH]);
                        f.reset();
                    } else {
                        this.store.handleError('メールアドレスは存在しません。');
                    }
                },
                err => {
                    this.store.handleError();
                }
            );
        }
    }
}
