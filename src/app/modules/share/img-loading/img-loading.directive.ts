import { HostListener, Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({ selector: '[app-img-loading-directive]' })
export class ImageLoadingDirective {
    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}
    @HostListener('load') onLoad() {
        // this.renderer.setAttribute(this.elementRef.nativeElement, "src", this.elementRef.nativeElement.src);
    }
    // @HostListener("error") onError() {
    //     this.renderer.setAttribute(this.elementRef.nativeElement, "src", this.onErrorSrc);
    // }
}
