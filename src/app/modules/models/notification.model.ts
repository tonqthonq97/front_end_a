export interface Notification {
    id: number;
    title: string;
    body: string;
    created: string;
    notification_type: number;
    read: number;
    survey_id?: number;
    survey_type?: number;
    start_date?: Date;
    end_date?: Date;
}
