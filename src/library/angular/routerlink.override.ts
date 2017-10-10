// How to use
// put RouterLinkOverride to your modulename.module.ts file
//  
// @NgModule({
//   imports: [
//     ...
//   ],
//   declarations: [
//       RouterLinkOverride,        
//     ...
//   ]
// })

import { Directive, Input } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';

import { LocationStrategy } from '@angular/common';
import { BrowserWindowRef } from '@ngsuit';


@Directive({selector: 'a[routerLink]'})
export class RouterLinkOverride extends RouterLinkWithHref {
  @Input() routerNav:boolean;
  @Input() extlink:string;   //use extenal link

  constructor(
    private router0: Router, private route0: ActivatedRoute,
    private locationStrategy0: LocationStrategy,
    private winRef: BrowserWindowRef) {
      super(router0, route0, locationStrategy0);
      super.onClick = this.onClick;
  }

  private attrBoolValue(s: any): boolean {
    return s === '' || !!s;
  }

  onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
    if (this.constructor.name != RouterLinkOverride.name) {
      return false;
    } 
    if (this.routerNav === false) {
      return false;
    }

    if (!this.routerLink && this.extlink != undefined) {
      let url = this.extlink;
      if (!this.extlink.startsWith('http://') && !this.extlink.startsWith('https://') && !this.extlink.startsWith('//')) {
        if (url.startsWith('/')) {
          url = url.substr(1);
        }
      }
      this.winRef.navigate(url);
      return false;
    }

    if (button !== 0 || ctrlKey || metaKey || shiftKey) {
      return true;
    }

    if (typeof this.target === 'string' && this.target != '_self') {
      return true;
    }

    const extras = {
      skipLocationChange: this.attrBoolValue(this.skipLocationChange),
      replaceUrl: this.attrBoolValue(this.replaceUrl),
    };
    
    this.router0.navigateByUrl(this.urlTree, extras);
    return false;
  }
}
