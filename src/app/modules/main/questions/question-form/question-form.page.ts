import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { ContactsPage } from '../../contacts/contacts.page';
import { Subscription, Observable } from 'rxjs';
import { Category } from 'src/app/modules/models/category.model';
import { QuestionsService } from '../questions.service';
import { PlaceholderDirective } from 'src/app/modules/share/placeholder-directive/placeholder.directive';
import { Store } from 'src/app/modules/share/store.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FULL_ROUTES } from 'src/app/modules/share/router-names';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-question-form',
    templateUrl: './question-form.page.html',
    styleUrls: ['./question-form.page.scss']
})
export class QuestionFormPage {
    @ViewChild(PlaceholderDirective, { static: false }) contactHost: PlaceholderDirective;
    title = 'ヘルプ';
    backUrl = FULL_ROUTES.QUESTIONS;

    contactHostViewContainerRef: ViewContainerRef;
    isContactCreated: boolean = false;
    emailSubscription: Subscription;
    emailList: String[] = [];
    categories$: Observable<Category[]>;
    message: string;
    categorySelected: number;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store,
        private questionsService: QuestionsService,
        private route: ActivatedRoute,
        private router: Router,
        private loadingCtrl: LoadingController
    ) {}

    ionViewWillEnter() {
        this.categories$ = this.questionsService.categories$;
    }

    onAddReceiver() {
        this.showContacts();
    }

    private showContacts() {
        const contactCmpFactory = this.componentFactoryResolver.resolveComponentFactory(ContactsPage);
        this.contactHostViewContainerRef = this.contactHost.viewContainerRef;
        this.contactHostViewContainerRef.clear();

        const componentRef = this.contactHostViewContainerRef.createComponent(contactCmpFactory);
        componentRef.instance.isDynamicCreated = true;

        this.emailSubscription = componentRef.instance.contactSelected.subscribe((email: string) => {
            this.emailList.push(email);
            this.contactHostViewContainerRef.clear();
            this.isContactCreated = false;
            this.emailSubscription.unsubscribe();
        });
        this.isContactCreated = true;
    }

    ionViewDidLeave() {
        if (this.contactHostViewContainerRef) {
            this.contactHostViewContainerRef.clear();
            this.isContactCreated = false;
        }
    }

    onDeleteEmail(email) {
        let elIndex = this.emailList.findIndex(el => el === email);
        this.emailList.splice(elIndex, 1);
    }

    onSubmit(form) {
        if (form.valid && this.categorySelected) {
            this.store.isLoading(true);
            this.questionsService.submitQuestion(+this.categorySelected, this.message).subscribe(
                res => {
                    // this.store.loadingSubject.next(false);
                    this.store.isLoading(false);
                    if (res.code && res.code === 200) {
                        form.reset();
                        this.store.alertSubject.next('送信されました。');
                        this.router.navigate([FULL_ROUTES.QUESTIONS]);
                    }
                },
                error => {
                    this.store.handleError();
                }
            );
        }
    }

    selectCategory(e: any) {
        this.categorySelected = e.detail.value;
    }
}
