import { Component, ViewChild, Input, Output, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, map, switchMap, take, first } from 'rxjs/operators';
import { Contact } from '../../models/contact.model';
import { ContactsService } from './contacts.service';
import { Store } from '../../share/store.service';
import { FULL_ROUTES } from '../../share/router-names';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.page.html',
    styleUrls: ['./contacts.page.scss']
})
export class ContactsPage implements AfterContentInit {
    @Input() isDynamicCreated: boolean;
    @Output() contactSelected = new Subject();
    title = '連絡先';

    contacts$: Observable<Contact[]>;
    disableScroll = false;
    contactSub: Subscription;
    input: string;
    isCreated = false;
    isLoading: boolean;
    phoneNumber = '84-28-5417-9013';
    mailAddress = 'school@jschoolhcmc.com';
    @ViewChild(IonInfiniteScroll, { static: false }) ionInfiniteScroll: IonInfiniteScroll;
    constructor(private router: Router, private contactsService: ContactsService, private store: Store) {}

    ngAfterContentInit() {
        if (this.isDynamicCreated) {
            setTimeout(() => {
                this.init();
            }, 0);
        }
    }

    ionViewWillEnter() {
        this.init();
    }

    init() {
        this.isLoading = true;
        this.contacts$ = this.contactsService.contacts$;

        if (this.input) {
            this.store.inputChanged(this.input);
        }

        this.contactSub = this.store.searchbar$
            .pipe(
                tap(search => {
                    this.input = search;
                    this.disableScroll = false;
                }),
                switchMap(search => {
                    return this.contactsService.fetchContacts(this.isCreated ? search : '', false);
                }),
                tap(res => {
                    this.isCreated = true;
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    onItemClick(id: number, email: string) {
        if (!this.isDynamicCreated) {
            this.router.navigate([FULL_ROUTES.CONTACTS, id]);
        } else {
            this.contactSelected.next(email);
        }
    }

    loadMoreData(event) {
        this.contactsService.loadMoreData(this.input, true).subscribe(
            (contacts: Contact[]) => {
                if (contacts.length !== 0) {
                    if (event) {
                        event.target.complete();
                    }
                } else {
                    this.disableScroll = true;
                }
            },
            err => {
                this.store.alertSubject.next('An error occurred while loading');
            }
        );
    }

    ionViewWillLeave() {
        this.contactSub.unsubscribe();
    }

    onCall(phone: string) {
        this.contactsService.call(phone);
    }

    onSendSMS(phone: string) {
        this.contactsService.sendSMS(phone);
    }

    onSendMail(mail: string) {
        this.contactsService.sendMail(mail);
    }
}
