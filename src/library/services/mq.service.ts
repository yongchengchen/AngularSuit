import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

export interface MQ_MSG_BODY {
    type:string,
    from?:string,
    callback?:(ret:any)=>void,
    data:any,
}

interface MQ_NODE {
    [key:string]:Subject<MQ_MSG_BODY>
}

@Injectable()
export class MQService {
    protected static nodes:MQ_NODE = {};

    constructor() {
        console.log('mq construct')
        // MQService.nodes = {};
    }

    notify(node: string, msg_body:MQ_MSG_BODY) {
        this.getNode(node).next(msg_body);
    }

    listen(node: string): Observable<MQ_MSG_BODY> {
        return this.getNode(node).asObservable();
    }
 
    clear() {
        for(let node in MQService.nodes) {
            MQService.nodes[node].next();
        }
    }

    deleteNode(node:string):void {
        if (MQService.nodes[node] != undefined) {
            delete MQService.nodes[node];
        }
    }

    private getNode(node:string):Subject<MQ_MSG_BODY> {
        if (MQService.nodes[node] === undefined) {
            MQService.nodes[node] = new Subject<MQ_MSG_BODY>();
        }
        return MQService.nodes[node];
    }
}