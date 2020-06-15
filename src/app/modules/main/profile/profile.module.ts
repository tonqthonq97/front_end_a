import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePage } from './profile.page';
import { SharePageModule } from '../../share/share.module';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
    {
        path: '',
        component: ProfilePage
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [ProfilePage, ChangePasswordComponent]
})
export class ProfilePageModule {}
