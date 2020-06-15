import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AbsenceReport } from '../../../models/absenceReport.model';
import { Store } from '../../../share/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../students.service';
import { FULL_ROUTES } from '../../../share/router-names';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-student-absence',
    templateUrl: './student-absence.page.html',
    styleUrls: ['./student-absence.page.scss']
})
export class StudentAbsencePage implements OnInit {
    title = '不在履歴レポート';
    studentId: number;
    backUrl: string;

    absenceRp$: Observable<AbsenceReport[]>;

    constructor(private route: ActivatedRoute, private studentService: StudentsService, private store: Store) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.studentId = this.route.snapshot.params['id'];
        this.backUrl = `${FULL_ROUTES.STUDENTS}/${this.studentId}`;
        this.store.setAbsenceFormRedirectUrl(FULL_ROUTES.STUDENTS + '/' + this.studentId);
    }
}
