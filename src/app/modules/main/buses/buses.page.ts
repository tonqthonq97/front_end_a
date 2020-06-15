import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusesService } from './buses.service';
import { Store } from '../../share/store.service';
import { Bus } from '../../models/busList.model';
import { first, finalize } from 'rxjs/operators';

@Component({
    selector: 'app-buses',
    templateUrl: './buses.page.html',
    styleUrls: ['./buses.page.scss']
})
export class BusesPage implements OnInit {
    title = 'バス';

    buses$: Observable<Bus[]>;

    constructor(private store: Store, private busesService: BusesService) {}
    ngOnInit() {
        this.buses$ = this.busesService.buses$;
    }

    ionViewWillEnter() {
        this.store.isLoading(true);
        this.busesService
            .fetchBuses()
            .pipe(
                first(),
                finalize(() => this.store.isLoading(false))
            )
            .subscribe();
    }

    ionViewWillLeave() {}
}
