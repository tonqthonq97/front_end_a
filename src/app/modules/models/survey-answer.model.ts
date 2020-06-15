export interface SurveyAnswer {
    survey_id: number;
    user_id: number;
    result: { question_id: number; answer: [] }[];
}
