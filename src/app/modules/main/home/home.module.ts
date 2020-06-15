import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SurveySlidePage } from './survey-slide/survey-slide.page';
import { SharePageModule } from '../../share/share.module';

@NgModule({
    imports: [
        SharePageModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ])
    ],
    declarations: [HomePage, SurveySlidePage]
})
export class HomePageModule {}
