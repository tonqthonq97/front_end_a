import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[imageLoader]'
})
export class ImageLoaderDirective {
    @Input() imageLoader;
    @Input() type = 'error';
    nativeEl: any;
    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.nativeEl = el.nativeElement;
        this.renderer.setStyle(this.nativeEl, 'background', "url('/assets/icon/spinner.gif') no-repeat center");
    }

    @HostListener('load') onLoaded() {
        // setTimeout(() => {
        // this.renderer.removeAttribute(this.nativeEl, 'src');
        // }, 3000);
        this.renderer.setStyle(this.nativeEl, 'background', 'none');
    }

    @HostListener('error') onError() {
        if (this.type === 'error') {
            this.renderer.setAttribute(this.nativeEl, 'src', 'assets/images/error.jpg');
        } else {
            this.renderer.setAttribute(this.nativeEl, 'src', 'assets/images/annonymous.jpg');
        }
    }
}
