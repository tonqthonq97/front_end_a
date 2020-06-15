import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AbsenceService } from '../absence.service';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
    title = '欠席確認';
    backBtn = false;
    dismissModal = true;
    @Input() form: NgForm;
    @Input() teacherId: number;
    @Input() studentId: number;
    dateStart: string;
    dateEnd: string;
    message: string;
    constructor(
        private loadingCtrl: LoadingController,
        private absenceService: AbsenceService,
        private store: Store,
        private router: Router,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        if (this.form) {
            this.dateStart = this.form.value.dateStart.substring(0, 10);
            this.dateEnd = this.form.value.dateEnd.substring(0, 10);
            this.message = this.form.value.message;
        }
    }

    sendRequest() {
        this.store.isLoading(true);
        this.absenceService
            .submitAbsenceRequest(this.teacherId, this.studentId, this.form)
            .pipe(first())
            .subscribe(
                resData => {
                    this.store.isLoading(false);
                    if (resData && resData['code'] === 200) {
                        this.store.alertSubject.next('送信されました。');
                        this.form.reset();
                        this.modalCtrl.dismiss();
                        this.router.navigate([FULL_ROUTES.ABSENCE]);
                    } else {
                        this.store.handleError();
                    }
                },
                error => {
                    this.store.handleError();
                }
            );
    }

    cancel() {
        this.modalCtrl.dismiss();
    }
}
