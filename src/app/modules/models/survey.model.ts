export interface Survey {
    survey_done: [{ id: number }, { name: string }];
    survey_not_done: [{ id: number }, { name: string }];
}

export enum SurveyLevel {
    NORMAL = 1,
    URGENT = 2
}
