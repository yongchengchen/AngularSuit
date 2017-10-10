import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

interface VAR_LIST {
    [key:string]:string;
}

@Injectable()
export class GobalVariableService {
    private list:VAR_LIST;

    constructor() {
        this.list = {};
        console.log('GobalVariableService constructor')
    }

    get(key:string):string {
        if (this.list[key]) {
            return <string>this.list[key];
        }
        return '';
    }
    
    set(key:string, value:any) {
        this.list[key] = value;
    }

    initFromRootElement(rootElement:ElementRef) {
        let attr:string = rootElement.nativeElement.getAttribute('globals');
        let items =  attr.split(';');
        let globals = {};
        for(let item of items) {
            let values = item.split('=');
            this.set(values[0], values[1]);
        }
    }
}