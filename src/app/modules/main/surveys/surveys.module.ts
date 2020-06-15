import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SurveysPage } from './surveys.page';
import { SurveyDetailPage } from './survery-detail/survey-detail.page';
import { SharePageModule } from '../../share/share.module';

const routes: Routes = [
    {
        path: '',
        component: SurveysPage
    },
    {
        path: ':id',
        component: SurveyDetailPage
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [SurveysPage, SurveyDetailPage]
})
export class SurveysPageModule {}
