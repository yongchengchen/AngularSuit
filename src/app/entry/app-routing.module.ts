import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROOTROUTES_DEFINES } from './assemble';

@NgModule({
    imports: ROOTROUTES_DEFINES,
    exports: [RouterModule]
})
export class AppRoutingModule { }