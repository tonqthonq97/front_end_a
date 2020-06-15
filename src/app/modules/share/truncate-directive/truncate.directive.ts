import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "truncate" })
export class TruncateDirective implements PipeTransform {
    transform(value: string, limit: number = 20, dot = true): string {
        if (dot) {
            return value.length >= 15 ? value.substr(0, limit) + "..." : value;
        } else {
            return value.length >= 15 ? value.substr(0, limit) : value;
        }
    }
}
