import { Injectable } from '@angular/core';

@Injectable()
export class BrowserWindowRef {
    getNativeWindow() {
        return window;
    }

    open(url:string) {
        this.getNativeWindow().open(url)
    }

    navigate(url:string) {
        this.getNativeWindow().location.href = url;
    }
}