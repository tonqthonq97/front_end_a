import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPage } from './main.page';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
    imports: [FormsModule, IonicModule, MainRoutingModule, CommonModule],
    declarations: [MainPage]
})
export class MainPageModule {}
