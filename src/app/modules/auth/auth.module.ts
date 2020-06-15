import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthPage } from './auth.page';
import { SharePageModule } from '../share/share.module';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';

const routes: Routes = [
    {
        path: '',
        component: AuthPage
    },
    {
        path: 'forgot-pwd',
        component: ForgotPwdComponent
    }
];

@NgModule({
    imports: [FormsModule, IonicModule, SharePageModule, RouterModule.forChild(routes)],
    declarations: [AuthPage, ForgotPwdComponent]
})
export class AuthPageModule {}
