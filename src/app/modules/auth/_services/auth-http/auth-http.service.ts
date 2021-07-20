import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NgxSpinnerService } from "ngx-spinner";
import { UsersTable } from '../../../../_fake/fake-db/users.table';

import { map, catchError } from 'rxjs/operators';

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})

export class AuthHTTPService {
  //apiUrl = "http://localhost:8000/api/";
  //apiUrl = "https://stage.webservices.artcalendar.it/api/";
  return: any;
  data: any;
  type: any;
  response: any;
  isLoadingSubject: BehaviorSubject<boolean>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(
    public http: HttpClient,
    private spinner: NgxSpinnerService,
    // public notify:NotifyService,
    // public auth:AuthService
  ) {
    //this.valid_token();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
  }
  //
  postData(data: any, type: any, auth: boolean = true): Observable<boolean> {
    this.isLoadingSubject.next(true);
    this.spinner.show();
    var API_URL = API_USERS_URL + "/auth/";
    if (auth == false) {
      var API_URL = API_USERS_URL + "/";
    }
    const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));

    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2) });
    if (authData) {
      console.log(authData.authToken);
      headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2), "Authorization": "Bearer " + authData.authToken });
    }

    return this.http.post<boolean>(API_URL + type, data, { headers: headers }).pipe(finalize(() => this.spinner.hide()));
  }
  getData(data: any, type: any): Observable<boolean> {
    // this.isLoadingSubject.next(true);
    this.spinner.show();
    var API_URL = API_USERS_URL + "/";
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8;boundary=' + Math.random().toString().substr(2), "Authorization": "Bearer " + data });
    return this.http.get<boolean>(API_URL + type, { headers: headers }).pipe(finalize(() => this.spinner.hide()));
  }
  validate_email(email: any, socialcheck = 0): Observable<boolean> {
    // this.isLoadingSubject.next(true);
    this.spinner.show();
    return this.postData({ 'email': email, 'socialcheck': socialcheck }, 'validate-email', false).pipe(finalize(() => this.spinner.hide()));
  }
  // // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string, socialcheck = 0): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  // public methods
  login(data: any, type: string): Observable<any> {
    return this.postData(data, type).pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          this.response.data;
          const auth = new AuthModel();
          auth.authToken = this.response.data.token;
          auth.refreshToken = this.response.data.token;
          auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          return auth;
        } else {

          return this.response.data.error;
        }
      })
    );
  }

  social_login(data: any, type: string): Observable<any> {
    return this.postData(data, type).pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          this.response.data;
          const auth = new AuthModel();
          auth.authToken = this.response.data.token;
          auth.refreshToken = this.response.data.token;
          auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
          return auth;
        } else {
          return this.response.success;
        }
      })
    );
  }

  userMetaAdd(data: any, type: string): Observable<any> {
    return this.postData(data, type, false).pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          this.response.data;
          return this.response;
        } else {
          return this.response.success;
        }
      })
    );
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  getUserByToken(token: string): Observable<UserModel> {
    return this.getData(token, 'user').pipe(
      map((result) => {
        this.response = result;
        if (this.response.success) {
          this.response = this.response.data.user;
          const user = new UserModel();
          user.setUser(this.response);
          // console.log(this.response);
          // console.log(user);
          // user.username = this.response.nickname;
          // user.fullname = this.response.first_name + " " + this.response.last_name;
          // user.email = this.response.email;
          // user.id = this.response.id;
          return user;
        } else {
          return this.response.success;
        }
      }
      )
    )
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }

}
