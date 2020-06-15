import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from 'src/app/modules/models/student.model';
import { take, first, tap } from 'rxjs/operators';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { StudentsService } from '../students.service';
import { ModalController } from '@ionic/angular';
import { StudentAbsencePage } from 'src/app/modules/main/students/student-absence/student-absence.page';

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.page.html',
    styleUrls: ['./student-detail.page.scss']
})
export class StudentDetailPage implements OnInit {
    title = '子供';
    backUrl = FULL_ROUTES.STUDENTS;

    student$: Observable<Student>;
    studentId: number;

    constructor(
        private router: Router,
        private store: Store,
        private route: ActivatedRoute,
        private studentService: StudentsService,
        private modalController: ModalController
    ) {}

    ngOnInit() {
        this.student$ = this.studentService.student$;
    }

    ionViewWillEnter() {
        this.studentId = this.route.snapshot.params['id'];
        this.studentService.getStudentDetail(+this.studentId).subscribe();
    }

    redirectToAbsencePage() {
        // this.store.backFromAbsence.next(false);
        this.router.navigate([FULL_ROUTES.STUDENT_ABSENCE_REPORT, this.studentId]);
        // this.modalController
        //     .create({ component: StudentAbsencePage, componentProps: { studentId: this.studentId } })
        //     .then(cpn => cpn.present());
    }
}
