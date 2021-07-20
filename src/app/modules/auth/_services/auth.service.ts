import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotifyService } from '../../../globalServices/notify/notify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  pass: string[] = [];
  passmsg: any = '';
  response: any;
  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    public notify: NotifyService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }
  validate_email(email: string, social = 0): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .validate_email(email, social)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  passwordMsg(ele: any){
    // var pass = this.formgroup.value.userdata.password;
    const pass = ele;
    console.log(ele);
    const hasNumber = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSpecial = /[$@$!%*?&]/.test(pass);
    this.passmsg = '';
    this.pass = [];
    if (!hasNumber){
      this.pass.push('need atleast 1 number');
    }
    if (!hasUpper){
      this.pass.push('need atleast 1 UpperCase');
    }
    if (!hasLower){
      this.pass.push('need atleast 1 LowerCase');
    }
    if (!hasSpecial){
      this.pass.push('need atleast 1 Special Character');
    }
    this.passmsg = this.pass.join('\n');
  }


  // // public methods
  login(data: any): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    console.log(data);
    return this.authHttpService.login(data, 'login').pipe(
      map((auth: AuthModel) => {
        console.log(auth);
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  social_login(data: any): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    console.log('-----------');
    console.log(data);
    return this.authHttpService.social_login(data, 'login').pipe(
      map((auth: AuthModel) => {
        console.log(auth);
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    console.log(auth);
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(data: any): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    console.log(data);
    return this.authHttpService.login(data, 'register').pipe(
      map((auth: AuthModel) => {
        console.log(auth);
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // auth_social_login(array:any){
  //   this.response = this.validate_email(array.email,1).then((result) => {
  //       this.response = result;
  //       console.log(this.response);
  //       if(this.response.success){
  //         this.notify.toast(this.response.data.message,1);
  //         const data:any = {};
  //         data['sociallogin'] = array.sociallogin;
  //         data['socialname'] = array.socialname;
  //         data['password'] = array.password;
  //         data['first_name'] = array.first_name;
  //         data['last_name'] = array.last_name;
  //         data['nickname'] = array.nickname ;
  //         data['email'] = array.email;
  //         this.register_user(data);
  //       }else{
  //         this.notify.toast(this.response.message.error,0,false);
  //       }
  //   });
  // }

  userMetaAdd(data){
    this.isLoadingSubject.next(true);
    return this.authHttpService.userMetaAdd(data, 'user/metadata/add').pipe(
      map((result) => {
          this.response = result;
          if (this.response.success){
            // this.response.data;
            return this.response;
          }else{
             return this.response.success;
          }
      })
    );
  }


  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // validate_email(email:any){  //ToDO:Call thia from Auth API
  //   this.api.postData({'email':email},'validate-email').then((result) => {
  //     this.response = result;
  //     if(this.response.success == 1){
  //       this.ngWizardService.next();
  //       this.api.notify.toast("valid Email",1);
  //     }else{
  //       this.api.notify.toast("invalid Email",0,false);
  //     };
  //   });
  // }
  // // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
