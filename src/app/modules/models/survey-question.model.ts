export interface SurveyQuestion {
    question_id: number;
    question: string;
    type: number;
    option: any;
    option_id: number;
    obligatory: number;
}

export interface NewSurveyQuestionFormat {
    question_id: number;
    question: string;
    type: number;
    options: { val: any; id: number; isChecked?: boolean }[];
    index?: number;
    require: boolean;
}
