import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainPage } from './main.page';
import { animate } from '@angular/animations';
import { ENDPOINTS, FULL_ROUTES } from '../share/router-names';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
    {
        path: ENDPOINTS.TABS, //tabs
        component: MainPage,
        children: [
            {
                path: ENDPOINTS.HOME,
                loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.BUSES,
                loadChildren: () => import('./buses/buses.module').then(m => m.BusesPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.PROFILE,
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.QUESTIONS,
                loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: `${ENDPOINTS.ABSENCE}`,
                loadChildren: () => import('./absence/absence.module').then(m => m.AbsencePageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.STUDENTS,
                loadChildren: () => import('./students/student.module').then(m => m.StudentsPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: `${ENDPOINTS.PICKUP}`,
                loadChildren: () => import('./pickup/pickup.module').then(m => m.PickupPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.CONTACTS,
                loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.SURVEYS,
                loadChildren: () => import('./surveys/surveys.module').then(m => m.SurveysPageModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.SCHEDULE,
                loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule)
                // canLoad: [AuthGuard]
            },
            {
                path: ENDPOINTS.NOTIFICATIONS,
                loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule)
                // canLoad: [AuthGuard]
            }
        ]
    },
    {
        path: '',
        redirectTo: FULL_ROUTES.HOME,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule {}
