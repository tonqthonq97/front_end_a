import { ScheduleSubject } from './schedule-subject.model';

export interface Schedule {
    group_id: number;
    group_name: string;
    schedule: ScheduleSubject[];
}
