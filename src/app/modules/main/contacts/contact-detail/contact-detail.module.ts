import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharePageModule } from 'src/app/modules/share/share.module';
import { ContactDetailPage } from './contact-detail.page';

const routes: Routes = [
    {
        path: '',
        component: ContactDetailPage
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [ContactDetailPage]
})
export class ContactDetailPageModule {}
