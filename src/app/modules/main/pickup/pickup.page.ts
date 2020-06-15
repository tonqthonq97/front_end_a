import { Component, OnInit } from '@angular/core';
import { Store } from '../../share/store.service';

@Component({
    selector: 'app-pickup',
    templateUrl: './pickup.page.html',
    styleUrls: ['./pickup.page.scss']
})
export class PickupPage {
    title = 'バスの乗車連絡';
    constructor(private store: Store) {}

    ionViewWillEnter() {
        this.store.refreshParent();
    }
}
