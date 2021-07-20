import { Injectable } from '@angular/core';
import { NotifyService } from './notify/notify.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/_services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import * as copy from 'copy-to-clipboard';

import { UserModel } from '../modules/auth/_models/user.model';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class gService {
  ENV = environment;
  user$: Observable<UserModel>;
  ResourseGroup = 'resourse';
  defualtWS: any;
  constructor(
    public notify: NotifyService,
    public http: HttpClient,
    public authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {

    const currentUrl = this.router.url;
    this.user$ = this.authService.currentUserSubject.asObservable();
    this.user$.subscribe((data) => {
      console.log('user data');
      console.log(data);
      this.defualtWS = Number(data.usermeta.defualtWS);
    });
  }

  postData(data: any, type: any): Observable<object> {
    this.spinner.show();
    const auth = this.authService.getAuthFromLocalStorage();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2), 'Authorization': "Bearer " + auth.authToken });
    return this.http.post<object>(API_USERS_URL + type, data, { headers }).pipe(finalize(() => this.spinner.hide()));
  }

  postDataMultipart(data: any, type: any): Observable<object> {
    this.spinner.show();
    const auth = this.authService.getAuthFromLocalStorage();
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + auth.authToken });
    return this.http.post<object>(API_USERS_URL + type, data, { headers }).pipe(finalize(() => this.spinner.hide()));

  }

  getData(type: any): Observable<any> {
    this.spinner.show();
    const auth = this.authService.getAuthFromLocalStorage();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2), 'Authorization': "Bearer " + auth.authToken });
    return this.http.get<object>(API_USERS_URL + type, { headers }).pipe(finalize(() => this.spinner.hide()));
  }
  getDataP(type: any) {
    this.spinner.show();
    let promise = new Promise((resolve, reject) => {
      const auth = this.authService.getAuthFromLocalStorage();
      let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2), 'Authorization': "Bearer " + auth.authToken });
      this.http.get(API_USERS_URL + type, { headers: headers }).subscribe(res => {
        //this.return = res;
        resolve(res);
        this.spinner.hide();
      }, (err) => {
        reject(err);
        this.spinner.hide();
      });
    });
    return promise;
  }
  validateEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  copy(v:string){
    copy(v);
  }

  getCountry(){
    let promise = new Promise((resolve, reject) => {
      this.getDataP(this.ResourseGroup + "/country").then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
  getState(id:number){
    let promise = new Promise((resolve, reject) => {
      this.getDataP(this.ResourseGroup + "/state/"+id).then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
  getCity(id:number){
    let promise = new Promise((resolve, reject) => {
      this.getDataP(this.ResourseGroup + "/city/"+id).then((result) => {
        resolve(result);
      });
    });
    return promise;
  }
}
