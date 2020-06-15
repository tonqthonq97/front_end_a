import { NgModule } from '@angular/core';
import { StudentDetailPage } from './student-detail.page';
import { Routes, RouterModule } from '@angular/router';
import { SharePageModule } from 'src/app/modules/share/share.module';

const routes: Routes = [
    {
        path: '',
        component: StudentDetailPage
    }
];

@NgModule({
    declarations: [StudentDetailPage],
    imports: [SharePageModule, RouterModule.forChild(routes)],
    exports: [StudentDetailPage]
})
export class StudentDetailPageModule {}
