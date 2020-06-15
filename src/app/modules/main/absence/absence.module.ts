import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AbsencePage } from './absence.page';
import { SharePageModule } from '../../share/share.module';
import { AbsenceFormPage } from './absence-form/absence-form.page';
import { FULL_ROUTES, ENDPOINTS } from '../../share/router-names';
import { StudentAbsenceSharePage } from '../../share/student-absence-share/student-absence-share.page';
import { FormAbsenceReportPage } from './absence-report/absence-report.page';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

const routes: Routes = [
    {
        path: '',
        component: AbsencePage
    },
    {
        path: ENDPOINTS.ABSENCE_REPORT + '/:id',
        component: FormAbsenceReportPage
    },
    {
        path: ':id',
        component: AbsenceFormPage
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [AbsencePage, AbsenceFormPage, FormAbsenceReportPage, ConfirmModalComponent],
    entryComponents: [ConfirmModalComponent]
})
export class AbsencePageModule {}
