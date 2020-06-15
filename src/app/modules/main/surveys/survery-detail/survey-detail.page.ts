import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewSurveyQuestionFormat } from 'src/app/modules/models/survey-question.model';
import { SurveysService } from '../surveys.service';
import { first, tap } from 'rxjs/operators';
import { IonContent, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Store } from 'src/app/modules/share/store.service';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';

@Component({
    selector: 'app-survey-detail',
    templateUrl: './survey-detail.page.html',
    styleUrls: ['./survey-detail.page.scss']
})
export class SurveyDetailPage implements OnInit {
    @ViewChild(IonContent, { static: false }) content: IonContent;
    @ViewChild('radioForm', { static: false }) radioForm: NgForm;
    title = 'ヘルプ';
    backUrl = FULL_ROUTES.SURVEYS;

    surveyId: number;
    questions: NewSurveyQuestionFormat[];
    questionsLength: number;
    currentQuestion: NewSurveyQuestionFormat;
    resultCurrentQuestion: any;
    currentQuestionIndex: number;
    radioIsCleared = false;
    surveyQuestionType = {
        CHECKBOX: 1,
        RADIO: 2,
        TEXT: 3
    };
    resultList: { survey_id: number; parent_id: number; question_id: number; answer: [] }[] = [];
    textareaAnswer: string;
    state = 'start';
    isLoading = true;
    isDisabled = true;
    constructor(
        private route: ActivatedRoute,
        private surveysService: SurveysService,
        private store: Store,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {}

    changeState() {
        return (this.state = 'start' ? 'end' : 'start');
    }
    ngOnInit() {}
    ionViewWillEnter() {
        this.isLoading = true;
        this.currentQuestionIndex = 0;
        this.resultList = [];

        this.surveyId = +this.route.snapshot.params['id'];
        this.surveysService
            .fetchSurveyQuestions(this.surveyId)
            .pipe(first())
            .subscribe(
                (questions: NewSurveyQuestionFormat[]) => {
                    this.isLoading = false;
                    if (questions.length !== 0) {
                        this.questions = questions;
                        this.questionsLength = questions.length;
                        this.currentQuestion = this.questions[
                            this.currentQuestionIndex ? this.currentQuestionIndex : 0
                        ];
                        this.isDisabled = this.currentQuestion.require ? true : false;
                    }
                },
                error => {
                    this.isLoading = false;
                    this.store.handleError();
                }
            );
    }

    onNext(questionIndex: number) {
        this.currentQuestionIndex = questionIndex;
        if (this.currentQuestion.index + 1 < this.questionsLength) {
            this.collectAnswers();
            this.currentQuestion = this.questions[questionIndex + 1];
            this.resultCurrentQuestion = null;
            this.content.scrollToTop();
            this.isDisabled = this.currentQuestion.require ? true : false;
        } else if (this.currentQuestion.index + 1 === this.questionsLength) {
            this.collectAnswers();
            this.store.isLoading(true);
            this.surveysService.sendSurveyResult(this.resultList).subscribe(
                resData => {
                    this.store.isLoading(false);
                    if (resData && resData['code'] === 200) {
                        this.store.alertSubject.next('ご回答ありがとうございました。');
                        this.router.navigate([FULL_ROUTES.SURVEYS]);
                    } else {
                        this.store.handleError();
                    }
                },
                error => {
                    this.store.handleError();
                }
            );
        }
        this.changeState();
    }

    collectAnswers() {
        switch (this.currentQuestion.type) {
            case this.surveyQuestionType.CHECKBOX:
                this.resultCurrentQuestion = this.currentQuestion.options
                    .filter((option, index) => option.isChecked === true)
                    .map(option => option.id);
                break;

            case this.surveyQuestionType.RADIO:
                const optionIndex = this.radioForm.value['radioItem'];
                this.resultCurrentQuestion = [
                    this.currentQuestion.options.find((el, index) => index === optionIndex).id
                ];
                this.radioForm.reset();
                break;

            case this.surveyQuestionType.TEXT:
                this.resultCurrentQuestion = [this.textareaAnswer];
                break;

            default:
                this.resultCurrentQuestion = this.resultCurrentQuestion;
        }
        this.store.parent$.pipe(first()).subscribe(parent => {
            this.resultList.push({
                survey_id: +this.surveyId,
                parent_id: parent.id,
                question_id: this.currentQuestion.question_id,
                answer: this.resultCurrentQuestion
            });
            this.textareaAnswer = '';
        });
    }

    checkDisableButton() {
        if (this.currentQuestion.require) {
            switch (this.currentQuestion.type) {
                case this.surveyQuestionType.CHECKBOX:
                    this.isDisabled = this.currentQuestion.options.find(el => el.isChecked) ? false : true;
                    break;
                case this.surveyQuestionType.RADIO:
                    this.isDisabled = this.radioForm.value['radioItem'] !== undefined ? false : true;
                    break;
                case this.surveyQuestionType.TEXT:
                    this.isDisabled = this.textareaAnswer ? false : true;
            }
        } else {
            this.isDisabled = false;
        }
    }
}
