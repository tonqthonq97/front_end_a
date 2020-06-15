import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSearchbar, Platform } from '@ionic/angular';
import { fromEvent, merge, Subscription } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, tap, shareReplay, skip } from 'rxjs/operators';
import { Store } from '../store.service';

@Component({
    selector: 'app-searchbar',
    templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
    @ViewChild(IonInfiniteScroll, { static: true }) ionInfiniteScroll: IonInfiniteScroll;
    @ViewChild(IonSearchbar, { static: true }) searchBar: IonSearchbar;
    isAndroid: boolean;
    fetchSubscription: Subscription;

    constructor(private store: Store, private platform: Platform) {}

    ngAfterContentInit() {
        // Adjust search icon on android
        this.isAndroid = this.platform.is('android') ? true : false;
        const searchbarEl = this.searchBar['el'];

        // Clear searchbar value
        this.store.clearSearchbarValue.subscribe(() => {
            this.searchBar.value = '';
        });

        // Store searchbar input
        const inputKeyup$ = fromEvent(searchbarEl, 'keyup');
        const inputClick$ = fromEvent(searchbarEl, 'click');
        const input$ = merge(inputKeyup$, inputClick$, this.store.clearSearchbarValue.asObservable());
        this.fetchSubscription = input$
            .pipe(
                map(event => {
                    if (event) {
                        return event.target['value'] || '';
                    } else {
                        return '';
                    }
                }),
                startWith(searchbarEl['value'] || ''),
                debounceTime(400),
                distinctUntilChanged(),
                skip(1),
                tap(input => {
                    this.store.inputChanged(input);
                })
            )
            .subscribe();
    }

    onClear(e: Event) {
        this.store.clearSearchbarValue.next();
    }

    onSubmit(e) {
        e.target.blur();
    }
}
