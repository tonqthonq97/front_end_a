import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '../store.service';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Student } from '../../models/student.model';
import { EventEmitter } from 'events';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
    isLoading = true;
    students$: Observable<Student[]>;

    constructor(private router: Router, private route: ActivatedRoute, private store: Store) {}
    ngOnInit() {
        this.store.isLoadingStudents.subscribe(state => {
            this.isLoading = state;
        });
        this.students$ = this.store.students$;
    }

    onChildClick(studentId: number) {
        this.router.navigate([studentId], { relativeTo: this.route });
    }
}
