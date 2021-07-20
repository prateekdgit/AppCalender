import { Injectable } from '@angular/core';
import { gService } from '../../../globalServices/g.service';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { WorkspaceModel } from '../_models/workspace.model';

const API_GROUP = '/workspace';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  response: any;
  currentWorkspaces: any;
  constructor(public GS: gService) {}

  // create(name:string) {
  //   this.GS.postData(name,API_GROUP+'/create')
  // }

  create(name: string): Observable<any> {
    console.log(name);
    return this.GS.postData({ name }, API_GROUP + '/create').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          // this.response.data;
          return this.response;
        } else {
          return this.response.success;
        }
      })
    );
  }
  delete(id: string): Observable<any> {
    return this.GS.postData({ id }, API_GROUP + '/delete').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          // this.response.data;
          return this.response;
        } else {
          return this.response;
        }
      })
    );
  }
  inviteUsers(data: any): Observable<any> {
    return this.GS.postData(data, API_GROUP + '/invite').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          // this.response.data;
          return this.response;
        } else {
          return this.response.success;
        }
      })
    );
  }
  join(data: any): Observable<any> {
    return this.GS.postData(data, API_GROUP + '/join').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          // this.response.data;
          return this.response;
        } else {
          return this.response.success;
        }
      })
    );
  }

  // list():Observable<any>{
  //   return this.GS.getData(API_GROUP+'/list').pipe(
  //     map((result) => {
  //         this.response = result;
  //         if(this.response.success){
  //           console.log("#####");
  //           console.log(this.response.data);
  //           console.log("#####>>");
  //           return this.response;
  //         }else{
  //            return this.response.success;
  //         }
  //     })
  //   )
  // }

  list() {
    const promise = new Promise((resolve, reject) => {
      this.GS.getDataP(API_GROUP + '/list').then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
  get(id: number) {
    const promise = new Promise((resolve, reject) => {
      this.GS.getDataP(API_GROUP + '/get/' + id).then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
  getRoles() {
    const promise = new Promise((resolve, reject) => {
      this.GS.getDataP(API_GROUP + '/roles').then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
  removeUser(data: any): Observable<any> {
    return this.GS.postData(data, API_GROUP + '/inviteDelete').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          // this.response.data;
          return this.response;
        } else {
          return this.response.success;
        }
      })
    );
  }
  setdefualt(event:any){
    console.log("event");
    console.log(event.value);
    this.GS.authService.userMetaAdd({ "meta_key": 'defualtWS', "meta_value": event.value }).subscribe((result) => {
      this.response = result;
      console.log("<<<<");
      console.log(this.response);
      console.log(">>>>");
      if (this.response.success) {
        //this.WS.GS.notify.toast(this.response.message.success, 1);
      } else {
        this.GS.notify.toast(this.response.data.error, 0, false);
      }
    });
  }
}

