import { Directive } from "@angular/core";
import { minDateValidator } from "src/app/modules/core/validators/min-date.validator";
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";

@Directive({
    selector: "[appCheckDate]",
    providers: [{ provide: NG_VALIDATORS, useExisting: MinDateDirective, multi: true }]
})
export class MinDateDirective implements Validator {
    validate(control: AbstractControl): { [key: string]: any } | null {
        return minDateValidator()(control) ? minDateValidator()(control) : null;
    }
}
