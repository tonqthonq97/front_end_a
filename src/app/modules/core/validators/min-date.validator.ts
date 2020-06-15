import { ValidatorFn, AbstractControl } from "@angular/forms";

export function minDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const reqTime = new Date(control.value);
        const now = new Date();
        if (reqTime.getFullYear() == now.getFullYear()) {
            if (reqTime.getMonth() < now.getMonth()) {
                return { minDate: { value: control.value } };
            } else if (reqTime.getMonth() === now.getMonth()) {
                if (reqTime.getDate() < now.getDate()) {
                    return { minDate: { value: control.value } };
                }
            }
        } else if (reqTime.getFullYear() < now.getFullYear()) {
            return { minDate: { value: control.value } };
        }
        return null;
    };
}
