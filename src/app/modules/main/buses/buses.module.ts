import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusesPage } from './buses.page';
import { SharePageModule } from '../../share/share.module';
import { BusRoutePage } from './bus-route/bus-route.page';
const routes: Routes = [
    {
        path: '',
        component: BusesPage
    },
    {
        path: ':id',
        component:BusRoutePage
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [BusesPage, BusRoutePage]
})
export class BusesPageModule {}
