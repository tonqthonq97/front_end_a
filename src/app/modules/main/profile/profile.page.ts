import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Parent } from '../../models/parent.model';
import { Observable } from 'rxjs';
import { Store } from '../../share/store.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FULL_ROUTES } from '../../share/router-names';
import { ContactsService } from '../contacts/contacts.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    title = 'プロフィール';
    parent$: Observable<Parent>;

    constructor(
        private authSv: AuthService,
        private store: Store,
        private router: Router,
        private contactsService: ContactsService
    ) {}

    ngOnInit() {
        this.parent$ = this.store.parent$;
    }

    ionViewWillEnter() {}

    onLogout() {
        this.authSv.logout();
    }

    onChangePassword() {
        this.router.navigate(['change-password']);
    }

    checkLastStudentSize(i: number, length: number) {
        return i === length - 1 && i % 2 === 0 ? 12 : 6;
    }

    onCall(phone: string) {
        this.contactsService.call(phone);
    }

    onSendMail(mail: string) {
        this.contactsService.sendMail(mail);
    }
}
