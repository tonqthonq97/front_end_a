import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, take, tap, first, throwIfEmpty, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/modules/models/category.model';
import { Question } from 'src/app/modules/models/question.model';
import { ResData } from '../../models/res-data.model';
import { Store } from '../../share/store.service';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
    private categorySubject = new BehaviorSubject<Category[]>([]);
    private questionSubject = new BehaviorSubject<Question[]>([]);

    categories$: Observable<Category[]> = this.categorySubject.asObservable();
    question$: Observable<Question[]> = this.questionSubject.asObservable();

    fetchLimit = 10;
    fetchIndex = 0;

    constructor(private http: HttpClient, private store: Store) {}

    fetchCategories(): Observable<Category[]> {
        return this.http.get<ResData>(environment.APIUrls.faqCategories).pipe(
            map((resData: any) => resData.data),
            tap(categories => {
                this.categorySubject.next(categories);
            })
        );
    }

    fetchCategoryQuestion(categoryId: number | string, loadMore: boolean, input: string = '') {
        if (!loadMore) {
            this.fetchIndex = 0;
        }
        categoryId = categoryId === -1 ? null : categoryId;
        let faqParams = new HttpParams();
        faqParams = faqParams.set('type', String(categoryId || ''));
        faqParams = faqParams.set('search', input);
        faqParams = faqParams.set('limit', String(this.fetchLimit));
        faqParams = faqParams.set('offset', String(this.fetchIndex));

        return this.http
            .get<ResData>(`${environment.APIUrls.faqQuestions}`, { params: faqParams })
            .pipe(
                map(resData => resData.data),
                map((questions: Question[]) => {
                    questions.forEach(question => {
                        const time = new Date(question.created);
                        question.created = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
                    });
                    return questions;
                }),
                tap(questions => {
                    this.setQuestionList(questions, loadMore);
                    this.fetchIndex += this.fetchLimit;
                })
            );
    }

    submitQuestion(category, question) {
        return this.store.parent$.pipe(
            first(),
            switchMap(parent => {
                const body = { parent_id: parent.id, type: category, question };
                return this.http.post<ResData>(`${environment.APIUrls.faqQuestions}`, body);
            })
        );
    }

    loadMoreData(categoryId, loadMore, input) {
        return this.fetchCategoryQuestion(categoryId, loadMore, input).pipe(first());
    }

    setQuestionList(questions: Question[], loadMore: boolean) {
        if (loadMore) {
            if (questions.length !== 0) {
                const oldQuestions = this.questionSubject.getValue();
                this.questionSubject.next([...oldQuestions, ...questions]);
            }
        } else if (!loadMore) {
            this.questionSubject.next([...questions]);
        }
    }
}
