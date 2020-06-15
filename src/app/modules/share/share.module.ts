import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { StudentListComponent } from './student-list/student-list.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { DropDownDirective } from './dropdown-directive/dropdown.directive';
import { MinDateDirective } from './mindate-directive/mindate.directive';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ImageLoading } from './img-loading/img-loading.component';
import { ImageLoadingDirective } from './img-loading/img-loading.directive';
import { PlaceholderDirective } from './placeholder-directive/placeholder.directive';
import { TruncateDirective } from './truncate-directive/truncate.directive';
import { SmallSpinnerComponent } from './small-spinner/small-spinner.component';
import { ContactsPage } from '../main/contacts/contacts.page';
import { ImageLoaderDirective } from './image-loader-directive/image-loader.directive';
import { CustomHeader } from './custom-header/custom-header.component';
import { StudentAbsenceSharePage } from './student-absence-share/student-absence-share.page';

@NgModule({
    declarations: [
        StudentListComponent,
        LoadingSpinnerComponent,
        SmallSpinnerComponent,
        StudentAbsenceSharePage,
        AlertComponent,
        DropDownDirective,
        MinDateDirective,
        SearchBarComponent,
        PlaceholderDirective,
        TruncateDirective,
        ImageLoaderDirective,
        ContactsPage,
        CustomHeader
    ],
    imports: [CommonModule, IonicModule, FormsModule, RouterModule],
    exports: [
        CommonModule,
        IonicModule,
        FormsModule,
        StudentAbsenceSharePage,
        StudentListComponent,
        LoadingSpinnerComponent,
        AlertComponent,
        DropDownDirective,
        SmallSpinnerComponent,
        MinDateDirective,
        SearchBarComponent,
        PlaceholderDirective,
        TruncateDirective,
        ImageLoaderDirective,
        ContactsPage,
        CustomHeader
    ],
    entryComponents: [ContactsPage]
})
export class SharePageModule {}
