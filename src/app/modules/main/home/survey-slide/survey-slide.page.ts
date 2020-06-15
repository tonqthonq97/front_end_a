import { Component, Input } from '@angular/core';
import { SurveysService } from '../../surveys/surveys.service';
import { SurveyLevel } from 'src/app/modules/models/survey.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { fadeInTrigger } from 'src/app/modules/share/animations/animations';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';

@Component({
    selector: 'app-survey-slide',
    templateUrl: './survey-slide.page.html',
    styleUrls: ['./survey-slide.page.scss'],
    animations: [fadeInTrigger]
})
export class SurveySlidePage {
    slideOpts = {
        slidesPerView: 'auto',
        pagination: false
        // autoHeight: true
    };

    @Input() surveys = [];
    constructor(private store: Store, private router: Router) {}

    goToSurvey(id) {
        this.router.navigate([FULL_ROUTES.SURVEYS, id]);
    }
}
