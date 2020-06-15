import { Component, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { Subscription } from 'rxjs';
import { repeatWhen, delay, tap, first, retryWhen } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BusesService } from '../buses.service';
import { BusDetail } from 'src/app/modules/models/busDetail.model';
import { School } from 'src/app/modules/models/school.model';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { LoadingController, IonContent } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { HttpClient } from '@angular/common/http';
import { ResData } from 'src/app/modules/models/res-data.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
declare var google;
@Component({
    selector: 'app-bus-route',
    templateUrl: './bus-route.page.html',
    styleUrls: ['./bus-route.page.scss']
})
export class BusRoutePage {
    @ViewChild('map', { static: false }) mapElement: ElementRef;
    title = 'バス';
    backUrl = FULL_ROUTES.BUSES;

    map: any;
    currentMapTrack = null;
    isTracking = false;
    personMarker: any;
    schoolMarker: any;
    busMarker: any;
    positionSubscription: Subscription;
    delayTimeBetweenTrack = 10000;
    isSetCenter = false;
    busId: number;
    circle: any;
    curLatLng: any;
    busDetail: BusDetail;
    isPopupShow = false;
    busFrameUrl: any;
    isShown = false;
    constructor(
        private store: Store,
        private location: Location,
        private route: ActivatedRoute,
        private busesService: BusesService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        public sanitizer: DomSanitizer
    ) {}

    ionViewWillEnter() {
        this.store.isLoading(true);
        this.busId = this.route.snapshot.params['id'];
        let busTick = 0;
        this.http
            .get<ResData>(
                `${environment.APIUrls.busList}/${this.busId}?id=${this.busId}&apikey=${environment.busAPI}&ticks=${busTick}`
            )
            .subscribe(res => {
                this.busFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.data['Url']);
                this.store.isLoading(false);
            });

        // if (!this.map || this.busId !== this.route.snapshot.params['id']) {
        //     this.busId = this.route.snapshot.params['id'];
        //     this.setGoogleMap();
        // }

        // // Create marker for school
        // this.createSchoolMarker();

        // // Create marker for parent
        // this.createUserMaker();

        // this.startTracking();
    }

    setGoogleMap() {
        const mapOptions = {
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            scaleControl: false
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.map.addListener('click', () => {
            this.isPopupShow = false;
        });
    }

    startTracking() {
        this.isTracking = true;
        this.positionSubscription = this.getBusPositionObs().subscribe(
            res => {},
            error => {
                this.store.handleError('場所取得エラー');
                this.location.back();
                this.store.alertSubject.next();
            }
        );
    }
    ionViewWillLeave() {
        this.isTracking = false;
        // this.positionSubscription.unsubscribe();
    }

    getBusPositionObs() {
        return this.busesService.fetchBusDetail(this.busId).pipe(
            // retryWhen(error$ => {
            //     return error$.pipe(delay(5000));
            // }),
            tap((bus: BusDetail) => {
                if (bus.X && bus.Y) {
                    // alert(`Y:${bus.Y}, X:${bus.X}`);
                    // if (!this.isSetCenter) {
                    //     this.map.setCenter(this.curLatLng);
                    //     this.isSetCenter = true;
                    // }
                    this.busDetail = bus;
                    this.curLatLng = new google.maps.LatLng(bus.Y, bus.X);
                    this.map.setCenter(this.curLatLng);

                    if (this.busMarker) {
                        this.busMarker.setPosition(this.curLatLng);
                    } else {
                        this.busMarker = this.createMarker('../../../../../assets/icon/bus-gps.png', bus.Y, bus.X);
                        this.busMarker.addListener('click', () => {
                            this.isPopupShow = !this.isPopupShow;
                        });
                    }
                } else {
                    this.store.handleError();
                    this.router.navigate([FULL_ROUTES.BUSES]);
                }
            }),
            repeatWhen(completed => {
                this.store.isLoading(false);
                return completed.pipe(delay(this.delayTimeBetweenTrack));
            })
        );
    }

    reCenter() {
        if (this.map && this.busMarker && this.curLatLng) {
            this.map.setCenter(this.curLatLng);
        }
    }

    drawCircle(rad) {
        this.circle = new google.maps.Circle({
            radius: rad,
            strokeColor: '#006bb3',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#33adff',
            fillOpacity: 0.35,
            map: this.map
        });
        this.circle.bindTo('center', this.personMarker, 'position');
    }

    createMarker(imgUrl, lat, lng) {
        return new google.maps.Marker({
            map: this.map,
            animation: null,
            position: { lat, lng },
            icon: {
                url: imgUrl,
                scaledSize: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0)
            }
        });
    }

    zoomIn() {
        const zoomLevel = this.map.getZoom();
        this.map.setZoom(zoomLevel + 1);
    }

    zoomOut() {
        const zoomLevel = this.map.getZoom();
        this.map.setZoom(zoomLevel - 1);
    }

    busName(busId: number) {
        return this.busesService.getBusName(busId);
    }

    createSchoolMarker() {
        if (!this.schoolMarker) {
            this.busesService
                .fetchSchool()
                .pipe(
                    tap((school: School) => {
                        this.schoolMarker = this.createMarker(
                            '../../../../../assets/icon/school-gps.png',
                            school.lat,
                            school.lng
                        );
                    })
                )
                .subscribe();
        }
    }
    createUserMaker() {
        if (!this.personMarker) {
            this.store.parent$.pipe(first()).subscribe(parent => {
                this.personMarker = new google.maps.Marker({
                    map: this.map,
                    animation: google.maps.Animation.BOUNCE,
                    position: { lat: parent['lat'], lng: parent['lng'] }
                });
            });
        }
    }
}
