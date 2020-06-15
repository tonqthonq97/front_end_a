import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsPage } from './contacts.page';
import { ContactDetailPage } from './contact-detail/contact-detail.page';
import { SharePageModule } from '../../share/share.module';

const routes: Routes = [
    {
        path: '',
        component: ContactsPage
    },
    {
        path: ':id',
        data: { routeName: 'contact-detail' },
        loadChildren: () => import('./contact-detail/contact-detail.module').then(m => m.ContactDetailPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), SharePageModule],
    declarations: []
})
export class ContactsPageModule {}
