import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './modules/auth/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharePageModule } from './modules/share/share.module';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({ animated: true }),
        AppRoutingModule,
        HttpClientModule,
        SharePageModule,
        BrowserAnimationsModule
    ],
    providers: [
        SplashScreen,
        StatusBar,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        FCM,
        Badge
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
