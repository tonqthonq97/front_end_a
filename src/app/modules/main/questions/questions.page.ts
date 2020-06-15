import { Component, ViewChild, OnInit } from '@angular/core';
import { QuestionsService } from './questions.service';
import { Category } from 'src/app/modules/models/category.model';
import { Question } from 'src/app/modules/models/question.model';
import { IonInfiniteScroll, IonSlides, Platform } from '@ionic/angular';
import { tap, switchMap, first } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { dropDownTrigger } from '../../share/animations/animations';
import { Store } from '../../share/store.service';
import { FULL_ROUTES } from '../../share/router-names';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.page.html',
    styleUrls: ['./questions.page.scss'],
    animations: [dropDownTrigger]
})
export class QuestionsPage implements OnInit {
    title = 'ヘルプ';
    input: string;
    categories$: Observable<Category[]>;
    questions$: Observable<Question[]>;
    disableScroll = false;
    currentActiveCategoryId = -1;
    searchbarSub: Subscription;
    isCreated = false;
    currentQuestionIndex = -1;
    animationState: number;
    isLoading = true;
    isIos: boolean;

    @ViewChild(IonInfiniteScroll, { static: false }) ionInfiniteScroll: IonInfiniteScroll;
    @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;

    constructor(
        private questionsService: QuestionsService,
        private store: Store,
        private router: Router,
        private platform: Platform
    ) {}

    slideOpts = {
        slidesPerView: 'auto'
    };

    ngOnInit() {
        this.categories$ = this.questionsService.categories$;
        this.questions$ = this.questionsService.question$;
        this.isIos = this.platform.is('ios') ? true : false;
    }

    ionViewWillEnter() {
        this.questionsService.fetchCategories().subscribe();
        this.setupSearchBar();
    }

    onCategoryClick(categoryId: number) {
        this.isLoading = true;
        this.currentActiveCategoryId = categoryId;
        this.disableScroll = false;
        this.questionsService.fetchCategoryQuestion(categoryId, false, this.input).subscribe(() => {
            this.isLoading = false;
        });
    }

    loadMoreData(event) {
        this.questionsService
            .loadMoreData(this.currentActiveCategoryId, true, this.input)
            .subscribe((questions: Question[]) => {
                if (questions.length !== 0) {
                    if (event) {
                        event.target.complete();
                    }
                } else {
                    this.disableScroll = true;
                }
            });
    }

    ionViewDidLeave() {
        this.searchbarSub.unsubscribe();
    }

    onAddNew() {
        this.router.navigate([FULL_ROUTES.QUESTION_NEW]);
    }

    changeState(i) {
        this.currentQuestionIndex = i;
        this.animationState = Math.random();
    }

    setupSearchBar() {
        if (this.input) {
            this.store.inputChanged(this.input);
        }

        this.searchbarSub = this.store.searchbar$
            .pipe(
                tap(search => {
                    this.input = search;
                    this.disableScroll = false;
                }),
                switchMap(search => {
                    return this.questionsService.fetchCategoryQuestion(
                        this.currentActiveCategoryId,
                        false,
                        this.isCreated ? search : ''
                    );
                }),
                tap(() => {
                    this.isCreated = true;
                    this.isLoading = false;
                })
            )
            .subscribe();
    }
}
