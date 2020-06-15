import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AbsenceReport } from '../../../models/absenceReport.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FULL_ROUTES } from '../../../share/router-names';
import { Store } from 'src/app/modules/share/store.service';

@Component({
    selector: 'app-student-absence',
    templateUrl: './absence-report.page.html'
})
export class FormAbsenceReportPage implements OnInit {
    title = '不在履歴レポート';
    studentId: number;
    backUrl: string;

    absenceRp$: Observable<AbsenceReport[]>;

    constructor(private route: ActivatedRoute, private store: Store) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.studentId = this.route.snapshot.params['id'];
        this.backUrl = `${FULL_ROUTES.ABSENCE}/${this.studentId}`;
        this.store.setAbsenceFormRedirectUrl(FULL_ROUTES.ABSENCE);
    }
}
