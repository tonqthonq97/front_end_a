import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from '../models/card.model';
import { FULL_ROUTES } from '../share/router-names';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    footerItems = [
        new Card('ホーム', 'home', FULL_ROUTES.HOME, '', 'home'),
        new Card('乗車連絡', 'calendar', FULL_ROUTES.PICKUP, '', 'pickup'),
        new Card('バス', 'bus', FULL_ROUTES.BUSES, '', 'buses'),
        new Card('お休み', 'log-out', FULL_ROUTES.ABSENCE, '', 'absences'),
        new Card('プロフィール', 'person', FULL_ROUTES.PROFILE, '', 'profile')
    ];

    getFooterItems() {
        return [...this.footerItems];
    }
}
