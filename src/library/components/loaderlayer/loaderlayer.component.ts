import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MQService } from '@ngsuit';

interface MSG {
    loading:boolean,
    error?:string,
    tip?:string,
    delay?:number
}

@Component({
    selector: 'app-loader',
    templateUrl: './loaderlayer.component.html',
    styleUrls: ['./loaderlayer.component.scss'],
    providers:[]
})

export class LoaderLayerComponent implements OnInit, OnDestroy{
    @Input() loading: boolean;
    controlMsg:MSG;
    subscription: Subscription;

    constructor(private mq:MQService) {}
    
    ngOnInit() {
        this.controlMsg = {loading:this.loading, tip:'', delay:0, error:''};
        this.subscription = this.mq.listen('app-loader').subscribe(message => { 
            let msg:MSG = <MSG>message.data;
            this.controlMsg.tip = (msg.tip === undefined ? '' : msg.tip);
            this.controlMsg.error = (msg.error === undefined ? '' : msg.error);
            this.controlMsg.delay = (msg.delay === undefined ? 0 : msg.delay);
            
            if (msg.loading) {
                this.loading = this.controlMsg.loading;
            } else {
                if ( msg.delay !== undefined) {
                    setTimeout(()=>{ 
                            this.loading = false;
                            this.controlMsg.tip = '';
                            this.controlMsg.error = '';
                        }, 
                        msg.delay * 1000
                    );
                } else {
                    this.loading = false;
                    this.controlMsg.tip = '';
                    this.controlMsg.error = '';
                }
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    asset(url:string, modulename:string=''):string {
        return url;
    }
}
