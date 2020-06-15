import { Student } from './student.model';

export interface Parent {
    id: number;
    full_name: string;
    image: string;
    email: string;
    phone: string;
    address: string;
    lat: number;
    lng: number;
    students: Student[];
}
