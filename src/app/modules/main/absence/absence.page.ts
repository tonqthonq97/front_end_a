import { Component, OnInit } from '@angular/core';
import { Store } from '../../share/store.service';

@Component({
    selector: 'app-absence',
    templateUrl: './absence.page.html',
    styleUrls: ['./absence.page.scss']
})
export class AbsencePage {
    title = 'お休み';

    constructor(private store: Store) {}

    ionViewWillEnter() {
        this.store.refreshParent();
    }
}
