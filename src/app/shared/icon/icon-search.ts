import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    selector: 'icon-search',
    template: `
        <ng-template #template>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" [ngClass]="class">
                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" stroke-width="2" opacity="0.5" />
                <path d="M18.5 18.5L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
        </ng-template>
    `,
})
export class IconSearchComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) {}
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
