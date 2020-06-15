import { NgModule } from '@angular/core';
import { NotificationsPage } from './notifications.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NotificationDetailPage } from './notification-detail/notification-detail.page';
import { SharePageModule } from '../../share/share.module';

const routes: Routes = [
    {
        path: '',
        component: NotificationsPage
    },
    {
        path: ':id',
        component: NotificationDetailPage
    }
];
@NgModule({
    declarations: [NotificationsPage, NotificationDetailPage],
    imports: [SharePageModule, RouterModule.forChild(routes)]
})
export class NotificationsModule {}
