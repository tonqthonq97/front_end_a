import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickupPage } from './pickup.page';
import { PickupFormPage } from './pickup-form/pickup-form.page';
import { SharePageModule } from '../../share/share.module';

const routes: Routes = [
    {
        path: '',
        component: PickupPage
    },
    {
        path: ':id',
        component: PickupFormPage
    }
];

@NgModule({
    declarations: [PickupFormPage, PickupPage],
    imports: [SharePageModule, RouterModule.forChild(routes)]
})
export class PickupPageModule {}
