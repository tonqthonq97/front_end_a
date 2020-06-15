import { Component, Input } from "@angular/core";

@Component({
    selector: "app-spinner",
    templateUrl: "./loading-spinner.component.html",
    styleUrls: ["./loading-spinner.component.scss"]
})
export class LoadingSpinnerComponent {
    @Input() backgroundColor: string;
    test = "ok";
}
