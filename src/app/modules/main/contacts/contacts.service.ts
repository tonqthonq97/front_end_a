import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResData } from '../../models/res-data.model';
import { Store } from '../../share/store.service';

@Injectable({ providedIn: 'root' })
export class ContactsService {
    private contactSubject = new BehaviorSubject<Contact[]>([]);
    contacts$: Observable<Contact[]> = this.contactSubject.asObservable();
    fetchLimit = 10;
    currentFetchIndex = 0;

    constructor(private http: HttpClient, private store: Store) {}

    fetchContacts(input: string, loadMore: boolean): Observable<Contact[]> {
        if (!loadMore) {
            this.currentFetchIndex = 0;
        }

        let faqParams = new HttpParams();
        faqParams = faqParams.set('limit', String(this.fetchLimit));
        faqParams = faqParams.set('search', input || '');
        faqParams = faqParams.set('offset', String(this.currentFetchIndex));

        return this.http
            .get<ResData>(`${environment.APIUrls.contacts}`, { params: faqParams })
            .pipe(
                map(resData => resData.data),
                map((contacts: Contact[]) => {
                    contacts.forEach(contact => {
                        contact.position = this.store.getUserPositionByLevel(contact.level);
                    });
                    return contacts;
                }),
                tap((contacts: Contact[]) => {
                    this.currentFetchIndex += this.fetchLimit;
                    this.setContactList(contacts, loadMore);
                })
            );
    }

    loadMoreData(input: string, loadMore: boolean) {
        return this.fetchContacts(input, loadMore);
    }

    setContactList(contacts: Contact[], loadMore: boolean) {
        if (loadMore) {
            if (contacts.length !== 0) {
                const oldContacts = this.contactSubject.getValue();
                this.contactSubject.next([...oldContacts, ...contacts]);
            }
        } else if (!loadMore) {
            this.contactSubject.next([...contacts]);
        }
    }

    getContactDetail(contactId: number) {
        return this.contacts$.pipe(map(contacts => contacts.find(el => el.id === contactId)));
    }

    call(phone: string) {
        phone = phone.replace(/-+\s/g, '');
        window.open(`tel:${phone}`);
    }

    sendSMS(phone: string) {
        phone = phone.replace(/-/g, '');
        window.open(`sms://${phone}/`, '_self');
    }

    sendMail(mail: string) {
        window.location.href = `mailto:${mail};`;
    }
}
