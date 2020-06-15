import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionsPage } from './questions.page';
import { QuestionFormPage } from './question-form/question-form.page';
import { SharePageModule } from '../../share/share.module';

const routes: Routes = [
    {
        path: '',
        component: QuestionsPage
    },
    {
        path: 'new',
        component: QuestionFormPage,
        data: { routeName: 'question-new' }
    }
];

@NgModule({
    imports: [SharePageModule, RouterModule.forChild(routes)],
    declarations: [QuestionsPage, QuestionFormPage]
})
export class QuestionsPageModule {}
