import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResData } from '../../models/res-data.model';
import { environment } from 'src/environments/environment';
import { map, tap, first } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { BusDetail } from '../../models/busDetail.model';
import { School } from '../../models/school.model';
import { Store } from '../../share/store.service';
import { Bus } from '../../models/busList.model';

@Injectable({ providedIn: 'root' })
export class BusesService {
    private schoolSubject = new BehaviorSubject<School>(null);
    private busSubject = new BehaviorSubject<Bus[]>(null);

    school$: Observable<School> = this.schoolSubject.asObservable();
    buses$: Observable<Bus[]> = this.busSubject.asObservable();

    constructor(private store: Store, private http: HttpClient) {}

    // New API

    fetchBuses(): Observable<Bus[]> {
        const params = new HttpParams().set('apikey', environment.busAPI);

        return this.http
            .get<ResData>(`${environment.APIUrls.busList}`, { params })
            .pipe(
                map(resData => (resData.code === 200 ? resData.data : [])),
                map((buses: Bus[]) => {
                    if (buses.length !== 0) {
                        buses.forEach(bus => {
                            const plateSplit = bus.Plate.split(' ');
                            bus.Plate = plateSplit.slice(1).join(' ');
                        });

                        buses = this.sortBuses(buses);
                        return buses;
                    } else {
                        return [];
                    }
                }),
                tap(buses => {
                    this.busSubject.next(buses);
                })
            );
    }

    fetchBusDetail(id: number): Observable<BusDetail> {
        const params = new HttpParams()
            .set('id', String(id))
            .set('ticks', String(0))
            .set('apikey', environment.busAPI);

        return this.http
            .get<ResData>(`${environment.APIUrls.busList}/${id}`, { params })
            .pipe(
                map(resData => (resData.code === 200 ? resData.data : {})),
                map((bus: BusDetail) => {
                    bus['name'] = this.getBusName(bus.Id);
                    bus['plate'] = this.getBusPlate(bus.Id);
                    return bus;
                })
            );
    }

    fetchSchool(): Observable<School> {
        return this.http.get<ResData>(`${environment.APIUrls.school}`).pipe(
            map(resData => resData.data[0]),
            tap(school => {
                this.schoolSubject.next(school);
            })
        );
    }

    getBusName(id) {
        const targetBus = this.busSubject.value.find(bus => bus.Id === id);
        if (targetBus) {
            return targetBus.Plate;
        } else {
            return 'Bus';
        }
    }

    getBusPlate(id) {
        const targetBus = this.busSubject.value.find(bus => bus.Id === id);
        if (targetBus) {
            return targetBus.ActualPlate;
        } else {
            return '';
        }
    }

    sortBuses(buses: Bus[]) {
        return buses.sort((a: any, b: any) => {
            const plateA: string = a.Plate.toLowerCase(),
                plateSplitA = plateA.split(' '),
                plateLastCharA: string = plateSplitA[plateSplitA.length - 1],
                plateB: string = b.Plate.toLowerCase(),
                plateSplitB = plateB.split(' '),
                plateLastCharB: string = plateSplitB[plateSplitB.length - 1];

            if (!isNaN(+plateLastCharA) && !isNaN(+plateLastCharB)) {
                return +plateLastCharA > +plateLastCharB ? 1 : -1;
            } else {
                return plateA > plateB ? 1 : -1;
            }
        });
    }
}
