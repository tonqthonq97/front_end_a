import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../absence.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, first, switchMap } from 'rxjs/operators';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { StudentsService } from '../../students/students.service';
import { Student } from 'src/app/modules/models/student.model';
import { LoadingController, ModalController } from '@ionic/angular';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Bus } from 'src/app/modules/models/busList.model';
import { BusesService } from '../../buses/buses.service';

@Component({
    selector: 'app-absence-form',
    templateUrl: './absence-form.page.html',
    styleUrls: ['/absence-form.page.scss']
})
export class AbsenceFormPage implements OnInit {
    title = 'お休み届け';
    backUrl: string;

    studentId: number;
    teacherId: number;
    now = new Date();
    minYear = this.now.getFullYear();
    maxYear = this.minYear + 1;
    isDateStartChanged = false;
    isDateEndChanged = false;
    student$: Observable<Student>;

    constructor(
        private router: Router,
        private store: Store,
        private route: ActivatedRoute,
        private studentService: StudentsService,
        private absenceService: AbsenceService,
        private loadingCtrl: LoadingController,
        private modalContrl: ModalController
    ) {}

    ngOnInit() {
        this.student$ = this.studentService.student$;
    }

    ionViewWillEnter() {
        this.isDateStartChanged = false;
        this.isDateEndChanged = false;
        this.studentId = +this.route.snapshot.params['id'];
        this.studentService
            .getStudentDetail(this.studentId)
            .pipe(
                tap(student => {
                    this.teacherId = student.teacher_id;
                }),
                switchMap(() => this.store.absenceFormBackRedirectUrl$),
                tap(url => (this.backUrl = url ? url : FULL_ROUTES.ABSENCE))
            )
            .subscribe(student => {});
    }

    checkInvalidDate(dateStart, dateEnd) {
        if (dateStart.value && dateEnd.value) {
            return dateStart.value > dateEnd.value;
        }
        return false;
    }

    viewAbsenceReport() {
        // this.store.backFromAbsence.next(true);
        this.router.navigate([FULL_ROUTES.FORM_ABSENCE_REPORT, this.studentId]);
        // this.modalController
        //     .create({ component: StudentAbsencePage, componentProps: { studentId: this.studentId } })
        //     .then(cpn => cpn.present());
    }
    onSubmit(form: NgForm) {
        if (form.valid) {
            if (form.value.dateStart > form.value.dateEnd) {
                this.store.alertSubject.next('開始日を終了日より前にしてください。');
            } else {
                this.modalContrl
                    .create({
                        component: ConfirmModalComponent,
                        componentProps: {
                            studentId: this.studentId,
                            teacherId: this.teacherId,
                            form: form
                        }
                    })
                    .then(el => el.present());
            }
        }
    }

    goToPickupForm() {
        this.router.navigate([FULL_ROUTES.PICKUP, this.studentId]);
    }

    onDateEndChange(dateEnd) {
        this.isDateEndChanged = dateEnd.value ? true : false;
    }

    onDateStartChange(dateStart) {
        this.isDateStartChanged = dateStart.value ? true : false;
    }
}
