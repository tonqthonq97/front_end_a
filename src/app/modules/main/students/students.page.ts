import { Component, OnInit } from '@angular/core';
import { Store } from '../../share/store.service';

@Component({
    selector: 'app-students',
    templateUrl: './students.page.html',
    styleUrls: ['./students.page.scss']
})
export class StudentsPage {
    title = '子供';
    constructor(private store: Store) {}

    ionViewWillEnter() {
        this.store.refreshParent();
    }
}
