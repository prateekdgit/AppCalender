import { Injectable } from '@angular/core';
import { gService } from '../../../globalServices/g.service';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { WorkspaceService } from '../../workspace/_service/workspace.service';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  response: any;
  API_GROUP = '/contact';
  constructor(public GS: gService, private WS: WorkspaceService) {}
  create(data: any): Observable<any> {
    console.log(name);
    return this.GS.postDataMultipart(data, this.API_GROUP + '/create').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          console.log(this.response.data);
          return this.response;
        } else {
          return this.response;
        }
      })
    );
  }
  delete(id: string): Observable<any> {
    console.log(name);
    return this.GS.postData({ id, workspace_id: this.GS.defualtWS }, this.API_GROUP + '/delete').pipe(
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
  list(): Observable<any> {
    // console.log(this.GS.defualtWS);
    // console.log('-------');
    console.log(this.WS.currentWorkspaces);
    return this.GS.postData({ workspace_id: this.GS.defualtWS }, this.API_GROUP + '/list').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          console.log(this.response);
          return this.response;
        } else {
          return this.response;
        }
      })
    );
  }
  get(id: number): Observable<any> {
    return this.GS.getData(this.API_GROUP + '/get/' + id).pipe(
      map((result) => {
        return result;
      })
    );
  }
  update(data: any): Observable<any> {
    return this.GS.postDataMultipart(data, this.API_GROUP + '/update').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          console.log(this.response.data);
          return this.response;
        } else {
          return this.response;
        }
      })
    );
  }
}
