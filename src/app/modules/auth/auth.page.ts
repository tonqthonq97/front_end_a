import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Store } from '../share/store.service';
import { FULL_ROUTES } from '../share/router-names';
import { first } from 'rxjs/operators';
import { Parent } from '../models/parent.model';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
    form: NgForm;
    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store,
        private loadingCtrl: LoadingController
    ) {}

    ngOnInit() {}
    ionViewWillEnter() {
        this.authService.user.pipe(first()).subscribe(user => {
            if (user) {
                this.router.navigate([FULL_ROUTES.HOME]);
            }
        });
    }

    onSubmit(form: NgForm) {
        this.store.isLoading(true);
        // this.loadingCtrl.create({ message: 'Loading data' }).then(el => el.present());
        this.form = form;
        const formValue = form.value;
        this.authService
            .login(formValue.email, formValue.password)
            .pipe(first())
            .subscribe(
                (parent: Parent) => {
                    if (parent.id) {
                        this.form.reset();
                        this.router.navigate([FULL_ROUTES.HOME]);
                        this.store.isLoading(false);
                    } else {
                        this.store.handleError();
                    }
                },
                error => {
                    this.store.handleError();
                }
            );
    }
}
