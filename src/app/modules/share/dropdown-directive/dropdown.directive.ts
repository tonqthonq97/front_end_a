import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({ selector: "[appDropdown]" })
export class DropDownDirective {
    private isOpen = false;
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @HostListener("click") toggleOpen() {
        const toggleEl = this.elementRef.nativeElement.nextSibling;
        const icon = this.elementRef.nativeElement.lastChild;
        if (!this.isOpen) {
            this.renderer.addClass(toggleEl, "show");
            this.renderer.addClass(icon, "rotate");
        } else {
            this.renderer.removeClass(toggleEl, "show");
            this.renderer.removeClass(icon, "rotate");
        }
        this.isOpen = !this.isOpen;
    }
}
