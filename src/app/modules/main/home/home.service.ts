import { SurveysService } from '../surveys/surveys.service';
import { Injectable } from '@angular/core';
import { Card } from '../../models/card.model';
import { FULL_ROUTES } from '../../share/router-names';

@Injectable({ providedIn: 'root' })
export class HomeService {
    cards = [
        // new Card('バス', '/assets/icon/school-bus.svg', FULL_ROUTES.BUSES, 'Xe buýt'),
        // new Card('スケジュール', '/assets/icon/schedule.svg', FULL_ROUTES.SCHEDULE, 'Thời khóa biểu'),
        new Card('子供', '/assets/icon/student.svg', FULL_ROUTES.STUDENTS, 'Học sinh'),
        // new Card('バスの乗車連絡', '/assets/icon/calendar.png', FULL_ROUTES.PICKUP, 'Đưa đón'),
        new Card('お休み', '/assets/icon/absence.png', FULL_ROUTES.ABSENCE, 'Xin phép'),
        // new Card('連絡先', '/assets/icon/contact.svg', FULL_ROUTES.CONTACTS, 'Liên hệ'),
        new Card('Q&A', '/assets/icon/qa.svg', FULL_ROUTES.QUESTIONS, 'Câu hỏi thường gặp'),
        new Card('アンケート', '/assets/icon/survey.png', FULL_ROUTES.SURVEYS, 'Khảo sát')
    ];
    constructor(private surveysService: SurveysService) {}

    getCards() {
        return [...this.cards];
    }
}
