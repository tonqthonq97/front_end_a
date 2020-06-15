import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/auth.guard';
import { ENDPOINTS } from './modules/share/router-names';

const routes: Routes = [
    { path: '', redirectTo: ENDPOINTS.APP, pathMatch: 'full' },
    {
        path: ENDPOINTS.APP,
        canLoad: [AuthGuard],
        loadChildren: './modules/main/main.module#MainPageModule'
    },
    {
        path: ENDPOINTS.AUTH,
        loadChildren: './modules/auth/auth.module#AuthPageModule'
    },
    {
        path: '**',
        redirectTo: ENDPOINTS.APP
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
