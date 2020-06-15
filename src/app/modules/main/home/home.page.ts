import { Component, OnInit } from '@angular/core';
import { IonTabs, Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SurveysService } from '../surveys/surveys.service';
import { dropDownTrigger, showTrigger, fadeInTrigger } from '../../share/animations/animations';
import { Store } from '../../share/store.service';
import { HomeService } from './home.service';
import { Card } from '../../models/card.model';
import { first } from 'rxjs/operators';
import { FULL_ROUTES } from '../../share/router-names';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    animations: [dropDownTrigger, showTrigger, fadeInTrigger]
})
export class HomePage implements OnInit {
    title = '保護者さん、こんにちは！';
    backBtn = false;

    surveysTimeout: any;
    parentId: number;
    urgentSurveys = [];
    amountNormalSurveys = 0;
    amountUrgentSurveys = 0;
    loadingState = 'hide';
    isLoading = true;
    delayBetweenFetch = 300000;
    cards: Card[];

    constructor(
        private store: Store,
        private tabs: IonTabs,
        private homeService: HomeService,
        private surveysService: SurveysService,
        private router: Router,
        private navCtrl: NavController
    ) {}

    ngOnInit() {}
    ionViewWillEnter() {
        this.store.tabs$.pipe(first()).subscribe(route => {
            this.tabs.select(route);
        });
        this.cards = this.homeService.getCards();
        this.keepFetchingSurveys();
    }

    ionViewWillLeave() {
        if (this.surveysTimeout) {
            clearTimeout(this.surveysTimeout);
        }
    }

    goTo(link) {
        // const tabName = link.substring(link.lastIndexOf('/') + 1);
        // this.store.goToTab(tabName);
        this.navCtrl.navigateForward(link);
    }

    keepFetchingSurveys() {
        this.isLoading = true;
        this.surveysService.fetchUrgentSurveysAndAmount().subscribe(
            data => {
                this.isLoading = false;
                this.urgentSurveys = data['urgentSurveys'] || [];
                this.amountNormalSurveys = data['normalAmount'] || 0;
                this.amountUrgentSurveys = data['urgentAmount'] || 0;
                this.surveysTimeout = setTimeout(() => {
                    this.keepFetchingSurveys();
                }, this.delayBetweenFetch);
            },
            error => {
                this.isLoading = false;
            }
        );
    }

    goToSurveys() {
        this.router.navigate([FULL_ROUTES.SURVEYS]);
    }
}
