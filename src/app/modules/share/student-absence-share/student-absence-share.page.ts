import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AbsenceReport } from '../../models/absenceReport.model';
import { Store } from '../store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../main/students/students.service';
import { FULL_ROUTES } from '../router-names';

@Component({
    selector: 'app-student-absence-share',
    templateUrl: './student-absence-share.page.html',
    styleUrls: ['./student-absence-share.page.scss']
})
export class StudentAbsenceSharePage implements OnInit, OnDestroy {
    studentId: number;
    absenceRp$: Observable<AbsenceReport[]>;
    isLoading: boolean;

    constructor(
        private store: Store,
        private route: ActivatedRoute,
        private router: Router,
        private studentService: StudentsService
    ) {}

    ngOnInit() {
        this.absenceRp$ = this.studentService.absenceRp$;
        this.isLoading = true;

        this.studentId = this.route.snapshot.params['id'];
        this.studentService.getAbsenceHistory(this.studentId).subscribe(
            res => {
                this.isLoading = false;
            },
            err => {
                this.isLoading = false;
                this.store.handleError();
            }
        );
    }

    ionViewWillEnter() {}

    onAddNew() {
        this.router.navigate([FULL_ROUTES.ABSENCE, this.studentId]);
    }

    ngOnDestroy() {}
}
