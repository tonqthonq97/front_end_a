import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/modules/models/contact.model';
import { Store } from 'src/app/modules/share/store.service';
import { ContactsService } from '../contacts.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.page.html',
    styleUrls: ['./contact-detail.page.scss']
})
export class ContactDetailPage {
    title = '連絡先';
    backUrl = FULL_ROUTES.CONTACTS;

    contactId: number;
    contact$: Observable<Contact>;

    constructor(private route: ActivatedRoute, private store: Store, private contactsService: ContactsService) {}
    ionViewWillEnter() {
        this.contactId = +this.route.snapshot.params.id;
        this.contact$ = this.contactsService.getContactDetail(+this.contactId);
    }

    onSendSMS(phone: string) {
        this.contactsService.sendSMS(phone);
    }

    onCall(phone: string) {
        this.contactsService.call(phone);
    }

    onSendMail(mail: string) {
        this.contactsService.sendMail(mail);
    }
}
