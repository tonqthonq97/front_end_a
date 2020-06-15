import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, first, retryWhen, delay, switchMap } from 'rxjs/operators';
import { Survey, SurveyLevel } from '../../models/survey.model';
import { ResData } from '../../models/res-data.model';
import { SurveyQuestion, NewSurveyQuestionFormat } from '../../models/survey-question.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '../../share/store.service';

@Injectable({ providedIn: 'root' })
export class SurveysService {
    private surveySubject = new BehaviorSubject<Survey>(null);
    surveys$: Observable<Survey> = this.surveySubject.asObservable();

    constructor(private http: HttpClient, private store: Store) {}

    fetchSurveys() {
        return this.store.parent$.pipe(
            first(),
            switchMap(parent => {
                return this.http.get<ResData>(`${environment.APIUrls.surveys}/${parent.id}`).pipe(
                    map(resData => resData.data),
                    tap((surveyList: Survey) => {
                        this.surveySubject.next(surveyList);
                    })
                );
            })
        );
    }

    fetchSurveyQuestions(surveyId: number): Observable<NewSurveyQuestionFormat[]> {
        return this.http.get<ResData>(`${environment.APIUrls.surveyQuestions}/${surveyId}`).pipe(
            map(resData => resData.data),
            map((questions: SurveyQuestion[]) => {
                const set = new Set();
                const newQuestionList = [];
                questions.forEach(question => {
                    if (!set.has(question.question_id)) {
                        set.add(question.question_id);
                        newQuestionList.push({
                            question_id: question.question_id,
                            question: question.question,
                            type: question.type,
                            options: question.option
                                ? [{ id: question.option_id, val: question.option, isChecked: false }]
                                : [],
                            require: question.obligatory === 1 ? true : false
                        });
                    } else {
                        const newQuestion = newQuestionList.find(
                            questionOfNewList => questionOfNewList.question_id === question.question_id
                        );
                        newQuestion.options.push({ id: question.option_id, val: question.option, isChecked: false });
                    }
                });

                return newQuestionList;
            }),
            tap((questions: NewSurveyQuestionFormat[]) => {
                questions.forEach((question, index) => {
                    question.options.sort((a, b) => {
                        return a.id - b.id;
                    });
                    question.index = index;
                });
            })
        );
    }

    sendSurveyResult(answers) {
        return this.http.post(environment.APIUrls.surveySubmit, { data: answers }).pipe(first());
    }

    fetchUrgentSurveysAndAmount() {
        return this.fetchSurveys().pipe(
            map(surveys => {
                if (surveys) {
                    const notDoneSurveys = surveys[1].survey_not_done;
                    const urgentSurveys = notDoneSurveys.filter(survey => {
                        return survey['type'] == SurveyLevel.URGENT;
                    });
                    return { normalAmount: notDoneSurveys.length, urgentAmount: urgentSurveys.length, urgentSurveys };
                } else {
                    return [];
                }
            }),
            retryWhen(error$ => {
                return error$.pipe(delay(5000));
            })
        );
    }
}
