// How to use
// put GLOBAL_ROUTEDEFS to your layout.module.ts file
//  
// @NgModule({
//     imports: GLOBAL_ROUTEDEFS,
//     exports: [RouterModule]
// })

import { Routes, RouterModule } from '@angular/router';

import { CHILDROUTES as BlogCHILDROUTES } from "Blog/assembly";
import { MENUS as BlogMENUS } from "Blog/assembly";
import { PROVIDERS as BlogPROVIDERS } from "Blog/assembly";
import { ROOTROUTES as RootLayoutROOTROUTES } from "RootLayout/assembly";

export const NOTFOUNDROUTES: Routes = [
{ path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
{ path: '**', redirectTo: 'not-found' }
];

export const ROOTROUTES_DEFINES = [ RouterModule.forRoot(RootLayoutROOTROUTES),RouterModule.forRoot(NOTFOUNDROUTES) ];

export const CHILDROUTES_DEFINES = [ RouterModule.forChild(BlogCHILDROUTES) ];

export const MENUS_DEFINES = [ BlogMENUS ];

export const PROVIDERS_DEFINES = [ BlogPROVIDERS ];