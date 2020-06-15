import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StudentsPage } from './students.page';
import { StudentDetailPage } from './student-detail/student-detail.page';
import { ENDPOINTS } from '../../share/router-names';
import { SharePageModule } from '../../share/share.module';
import { AbsenceFormPage } from '../absence/absence-form/absence-form.page';
import { PickupFormPage } from '../pickup/pickup-form/pickup-form.page';
import { StudentAbsencePage } from './student-absence/student-absence.page';

const routes: Routes = [
    {
        path: '',
        component: StudentsPage
    },

    {
        path: ENDPOINTS.ABSENCE_REPORT + '/:id',
        component: StudentAbsencePage
    },
    {
        path: ':id',
        component: StudentDetailPage
    }
];

@NgModule({
    declarations: [StudentsPage, StudentDetailPage, StudentAbsencePage],
    imports: [SharePageModule, RouterModule.forChild(routes)],
    exports: []
})
export class StudentsPageModule {}
