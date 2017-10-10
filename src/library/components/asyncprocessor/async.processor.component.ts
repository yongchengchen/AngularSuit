import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MQService } from '@ngsuit';
import * as uuid from "uuid";

export interface ASYNC_TASK_ACTION_BUILDER_RETURN {
    url:string,
    body:any,
    options:any
}

export interface ASYNC_TASK_REPOSITORY_CALLBACK_RETURN {
    to_continue:boolean, 
    items:string[],
    total:number
}

//if support pagination, repository's url should have reserve place({0}) for pagination
export interface ASYNC_TASK_PARAMETER {
    action_builder(ids:string[],uuid:string):ASYNC_TASK_ACTION_BUILDER_RETURN;
    _token?:string;
    step?:number;
    autostart?:boolean;
    keys?:string[];
    repository?:{
        url:string,
        callback(resp:any):ASYNC_TASK_REPOSITORY_CALLBACK_RETURN,
        pagination?:boolean
    }
}

interface ANALYSIS_PROCESS_RESULT {
    success:boolean,
    messages:{[key:string]:string};
}

interface CONSOLE_LOG {
    level:string,
    info:string
}

@Component({
    selector: 'async-processer-delegator',
    templateUrl: './async.processor.component.html',
    styleUrls: ['./async.processor.component.scss'],
    providers: [NgbModal]
})
export class AsyncProcessorComponent implements OnInit, OnDestroy{
    @ViewChild('content') content:ElementRef;
    private subscription: Subscription;
    private modal:NgbModalRef;
    private pending:boolean = false;
  
    private process_ids:string[];
    private error_count:number = 0;
    private parameter:ASYNC_TASK_PARAMETER = null
    private _uuid:string = '';
  
    i:number = 0;
    total:number = 0;
    buttonTitle:string = 'Start'
    bCanStart:boolean = false;
    bCanRetry:boolean = false;
    bCanClose:boolean = false;
    bCanLoadResult:boolean = false;
    logs:CONSOLE_LOG[] = [];
    
    private taskFrom:string = '';  //who send task message to the module

    constructor(private modalService: NgbModal, private http:HttpClient, private mq:MQService) { }

    open() {
        let pthis = this;
        this.modal = this.modalService.open(this.content,{ backdrop : 'static', keyboard  : false});
    }

    ngOnInit() {
        this.subscription = this.mq.listen('progressbar-modal').subscribe(msg => {
            this.taskFrom = msg.from;
            this.attachTask(msg.data);
            this.open();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    attachTask(parameter:ASYNC_TASK_PARAMETER) {
        this.pending = true;
        this.logs = [];
        this.i = 0;
        this.error_count = 0;
        this.parameter = parameter;
        this.bCanStart = true;
        this.buttonTitle = 'Start'
        this.bCanRetry = false;
        this.bCanClose = false;
        this.bCanLoadResult = false;

        if (!this.parameter.step) {
            this.parameter.step = 1;
        }
        if (this.parameter.keys != undefined) {
            this.process_ids = this.parameter.keys;
            if (this.parameter.autostart) {
                this.start();
            }
            return;
        } else {
            if (this.parameter.repository === undefined) {
                this.log('error', 'Parameter should has keys or repository');
                this.bCanClose = true;
                return;
            }
            this.process_ids = [];
            this.getTaskResource(1);
        }
    }

    private getTaskResource(page:number) {
        let url = this.parameter.repository.url;
        if (this.parameter.repository.pagination) {
            url = url.replace('{0}', String(page));
        }

        /*let req = this.http.get(url).catch((error: any) => {
            this.mq.notify('app-loader', {type:"", data:{loading:false, tip:error.toString(), delay:2}});
            this.log('error', 'Error happens when try to load task parameter.');
            this.log('error', url);
            this.log('error', JSON.stringify(error));
            this.bCanClose = true;
        });*/

        this.http.get(url).subscribe(resp => {
            if (this.parameter.repository.callback) {
                let ret = this.parameter.repository.callback(resp);
                this.process_ids = this.process_ids.concat(ret.items);
                if (ret.to_continue && this.parameter.repository.pagination) {
                    this.getTaskResource(++page);
                }
                this.total = ret.total;
                if (page<=2) {
                    this.start();
                }
                console.log('ret', this.process_ids);
            }
            
        });
    }

    start() {
        this._uuid = uuid.v4();
        this.pending = false;
        this.buttonTitle = 'Pause'
        // this.total = this.parameter.keys.length;
        this.log('system', '>>>>>>>>>start processing>>>>>>>>>');
        this.tryprocess();
    }

    pauseOrResume() {
        this.pending = !this.pending;
        if (this.pending) {
            this.buttonTitle = 'Resume'
            this.log("warn", "|||||||||||||||   Process paused   |||||||||||||||")
        } else {
            this.buttonTitle = 'Pause'
            this.log('warn', '>>>>>>>>>Process resumed>>>>>>>>>');
            this.tryprocess();
        }
    }
    
    retry() {
        this.pending = false;
        this.i = 0;
        this.error_count = 0;
        this.bCanStart = true;
        this.bCanRetry = false;
        this.bCanClose = false;
        this.bCanLoadResult = false;
        this.start();
    }

    loadResult() {
        this.mq.notify(this.taskFrom, {type:'async_process_finished', data:{ uuid:this._uuid}});
        this.modal.close();
    }

    log(level:string, message:string) {
        // this.logs.push({level:level,info:message});
        this.logs.unshift({level:level,info:message});
    };

    tryprocess() {
        if (!this.pending) {
            let post_keys = [];
            for(let i=0; i<this.parameter.step; i++) {
                if (this.i < this.process_ids.length) {
                    post_keys.push(this.process_ids[this.i]);
                    this.i++;
                }
            }
            if (post_keys.length > 0) {
                this.process({
                    keys: post_keys,
                    _token: this.parameter._token
                }, 'post');
            } else {
                this.log('system', '========= process finished =========');
                if (this.error_count > 0) {
                    this.log('error', '|||||||||||||||||||||||||||||||||||||||||||||');
                    this.log('error', '===== You got ' + this.error_count +' errors, please fix first ====');
                    this.log('error', '|||||||||||||||||||||||||||||||||||||||||||||');
                    this.bCanRetry = true;
                    this.bCanClose = true;
                    this.bCanLoadResult = true;
                } else {
                    this.loadResult();
                }
                this.bCanStart = false;
            }
        }
    }

    process(params, httpmethod) {
        let action = this.parameter.action_builder(params.keys, this._uuid);
        console.log('action', action)
        /*let req = this.http.post(action.url, action.body, action.options).catch((error: any) => {
            this.mq.notify('app-loader', {type:"", data:{loading:false, tip:error.toString(), delay:2}});
            console.log('error',error);
            this.error_count ++;
        });*/

        this.http.post(action.url, action.body, action.options).subscribe(resp => {
            // let ret = <ANALYSIS_PROCESS_RESULT>resp.json();
            for(let key in resp['messages']) {
                this.log(resp['messages'][key],key);
                if (resp['messages'][key] =='error') {
                    this.error_count++;
                }
            }
            this.tryprocess();
        });
    }
}
