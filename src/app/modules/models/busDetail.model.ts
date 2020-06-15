import { Data } from '@angular/router';

export interface BusDetail {
    Id: number;
    GpsTime: Date;
    SysTime: Date;
    X: number;
    Y: number;
    Status: number;
    Speed: number;
    Heading: number;
    Address: string;
    Sensors: any;
    Distance: number;
    Url: string;
    name?: string;
    plate?: string;
}
