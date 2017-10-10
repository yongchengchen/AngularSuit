import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterLinkOverride } from './angular/routerlink.override';

import {
    LoaderLayerComponent, 
    AsyncProcessorComponent,

    MQService,
    BrowserWindowRef,
    GobalVariableService,

    DefaultValuePipe, 
    SafeHtmlPipe, 
    LocalDatePipe
} from './index'

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
    ],
    exports: [
        LoaderLayerComponent, 
        AsyncProcessorComponent, 
        SafeHtmlPipe, 
        DefaultValuePipe, 
        LocalDatePipe,
        RouterLinkOverride
    ],
    declarations: [
        LoaderLayerComponent, 
        AsyncProcessorComponent, 
        SafeHtmlPipe, 
        DefaultValuePipe, 
        LocalDatePipe,
        RouterLinkOverride
    ],
    providers: [
        MQService,
        BrowserWindowRef,
        GobalVariableService
    ],
})
export class AppLibsModule { }