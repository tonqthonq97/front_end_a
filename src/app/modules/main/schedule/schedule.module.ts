import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SharePageModule } from '../../share/share.module';
import { SchedulePage } from './schedule.page';

const routes: Routes = [{ path: '', component: SchedulePage }];
@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [SchedulePage]
})
export class ScheduleModule {}
