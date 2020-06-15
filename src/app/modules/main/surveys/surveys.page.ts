import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SurveysService } from './surveys.service';
import { Observable } from 'rxjs';
import { Survey, SurveyLevel } from '../../models/survey.model';
import { Store } from '../../share/store.service';
import { FULL_ROUTES } from '../../share/router-names';

@Component({
    selector: 'app-surveys',
    templateUrl: './surveys.page.html',
    styleUrls: ['./surveys.page.scss']
})
export class SurveysPage {
    title = 'アンケート';
    surveys$: Observable<Survey>;
    isLoading = true;

    constructor(private router: Router, private store: Store, private surveysService: SurveysService) {}
    ionViewWillEnter() {
        this.isLoading = true;
        this.surveys$ = this.surveysService.surveys$;
        this.surveysService.fetchSurveys().subscribe(
            () => {
                this.isLoading = false;
            },
            err => {
                this.isLoading = false;
                this.store.handleError();
            }
        );
    }

    onViewDetail(id: number) {
        this.router.navigate([FULL_ROUTES.SURVEYS, id]);
    }

    checkType(type: number) {
        return type === SurveyLevel.URGENT ? 'type1' : 'type2';
    }
}
