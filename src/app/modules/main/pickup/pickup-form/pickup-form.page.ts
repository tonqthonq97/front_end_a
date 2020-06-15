import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PickupService } from '../pickup.service';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { StudentsService } from '../../students/students.service';
import { Student } from 'src/app/modules/models/student.model';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { Bus } from 'src/app/modules/models/busList.model';
import { BusesService } from '../../buses/buses.service';
import { first, finalize } from 'rxjs/operators';

@Component({
    selector: 'app-pickup-form',
    templateUrl: './pickup-form.page.html',
    styleUrls: ['./pickup-form.page.scss']
})
export class PickupFormPage implements OnInit {
    title = 'バスの乗車連絡';
    backUrl = FULL_ROUTES.PICKUP;

    buses$: Observable<Bus[]>;

    now = new Date();
    minYear = this.now.getFullYear();
    maxYear = this.minYear + 1;
    isDateStartChanged = false;
    isDateEndChanged = false;
    studentId: number;
    teacherId: number;
    student$: Observable<Student>;
    isLoadingBuses: boolean;
    busName: string;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store,
        private pickupService: PickupService,
        private studentService: StudentsService,
        private loadingCtrl: LoadingController,
        private busesService: BusesService
    ) {}

    ngOnInit() {
        this.buses$ = this.busesService.buses$;
        this.student$ = this.studentService.student$;
    }
    ionViewWillEnter() {
        this.isLoadingBuses = true;
        this.busesService
            .fetchBuses()
            .pipe(
                first(),
                finalize(() => (this.isLoadingBuses = false))
            )
            .subscribe();

        this.isDateStartChanged = false;
        this.isDateEndChanged = false;
        this.studentId = +this.route.snapshot.params['id'];
        this.studentService.getStudentDetail(this.studentId).subscribe(student => {
            this.teacherId = student.teacher_id;
        });
    }

    checkInvalidDate(dateStart, dateEnd) {
        dateStart = new Date(dateStart);
        if (dateStart.value && dateEnd.value) {
            alert(dateStart.value > dateEnd.value);
            return dateStart.value > dateEnd.value;
        }
        return false;
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            if (form.value.dateStart > form.value.dateEnd) {
                this.store.alertSubject.next('開始日を終了日より前にしてください。');
            } else {
                this.store.isLoading(true);
                this.pickupService.submitPickupRequest(this.studentId, this.busName, form).subscribe(
                    resData => {
                        this.store.isLoading(false);
                        if (resData && resData['code'] === 200) {
                            this.store.alertSubject.next('送信されました。');
                            this.router.navigate([FULL_ROUTES.PICKUP]);
                            form.reset();
                            this.busName = null;
                        } else {
                            this.store.handleError();
                        }
                    },
                    error => {
                        this.store.handleError();
                    }
                );
            }
        }
    }

    selectBus(e) {
        this.busName = e.detail.value;
    }

    onDateEndChange(dateEnd) {
        this.isDateEndChanged = dateEnd.value ? true : false;
    }

    onDateStartChange(dateStart) {
        this.isDateStartChanged = dateStart.value ? true : false;
    }
}
