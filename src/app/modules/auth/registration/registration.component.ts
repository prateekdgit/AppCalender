import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription, Observable, of } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
import { gService } from "../../../globalServices/g.service";
import { WorkspaceService } from "../../workspace/_service/workspace.service";

import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  newWS: any;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  response: any;
  // userData:any;
  // email:any;
  // password:any;
  formgroup: any;
  status = "";
  pass: string[] = [];
  passmsg: any = "";
  talents: any;
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden,
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      showPreviousButton: false,
      toolbarExtraButtons: [
        // { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
      ],
    },
  };

  userRoles = {};
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private ngWizardService: NgWizardService,
    private GS: gService,
    private WS: WorkspaceService,
    private cd: ChangeDetectorRef,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.talents = [
      { value: "singer", viewValue: "Singer" },
      { value: "musician", viewValue: "Musician" },
      { value: "dancer", viewValue: "Dancer" },
    ];
  }

  ngOnInit(): void {
    
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      userdata: this.fb.group({
        first_name: ["", Validators.required],
        last_name: ["", Validators.required],
        nickname: ["", Validators.required],
      }),
      password: this.fb.group(
        {
          password: [
            "",
            Validators.compose([
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{6,}"
              ),
            ]),
          ],
          cpassword: [
            "",
            Validators.compose([
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(
                "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{6,}"
              ),
            ]),
          ],
        },
        { validator: this.c_password }
      ),
      //agree: [false, Validators.compose([Validators.required])],
      workspace: this.fb.group({
        name: ["", Validators.required],
      }),
      invite: this.fb.array([]),
      talent: this.fb.group({
        talent: ["", Validators.required],
      }),
    });

  }

  invite(): FormArray {
    return this.registrationForm.get("invite") as FormArray;
  }
  newInvite(): FormGroup {
    return this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      role: ["", Validators.required],
    });
  }
  addInvite() {
    console.log(this.newInvite());
    this.invite().push(this.newInvite());
  }
  removeInvite(i: number) {
    this.invite().removeAt(i);
  }
  getRoles() {
    this.WS.getRoles().then((result) => {
      this.response = result;
      console.log(this.response);
      if (this.response.success) {
        // this.userRoles = this.response.data.json();
        // this.userRoles = Array.of(this.userRoles);
        // console.log(this.userRoles);
        this.userRoles = Object.values(this.response.data);
        console.log(this.userRoles);
        this.cd.markForCheck();
      } else {
        this.WS.GS.notify.toast("Roles Not Found !!", 0, false);
      }
    });
  }
  // submit() {
  //   this.hasError = false;
  //   const result = {};
  //   Object.keys(this.f).forEach(key => {
  //     result[key] = this.f[key].value;
  //   });
  //   const newUser = new UserModel();
  //   newUser.setUser(result);
  //   const registrationSubscr = this.authService
  //     .registration(newUser)
  //     .pipe(first())
  //     .subscribe((user: UserModel) => {
  //       if (user) {
  //         this.router.navigate(['/']);
  //       } else {
  //         this.hasError = true;
  //       }
  //     });
  //   this.unsubscribe.push(registrationSubscr);
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  gonext(step: any) {
    console.log(this.registrationForm.value);
    switch (step) {
      case "step1": {
        this.validate_email(this.registrationForm.value.email);
        break;
      }
      case "step2": {
        this.ngWizardService.next();
        
        break;
      }
      case "step3": {
        //this.formgroup = [];        
        const data = this.registrationForm.value.userdata;
        data["email"] = this.registrationForm.value.email;
        //data["password"] = this.registrationForm.value.password.password;
        console.log(data);
        this.register_user(data);
        break;
      }
      case "step4": {
        this.getRoles();
        const data = this.registrationForm.value.workspace;
        console.log(data);
        this.response = this.WS.create(data.name).subscribe((result) => {
          this.response = result;
          this.newWS = this.response.data.workspace.id;
          if (this.response.success) {
            this.GS.notify.toast(this.response.message.success, 1);
            this.ngWizardService.next();
          } else {
            this.GS.notify.toast(this.response.message.error, 0, false);
          }
        });
        console.log(this.response);
        // if(this.response){

        // }
        //this.redirecttodash();
      }
      case "step5": {
        let data = this.registrationForm.value.invite;
        console.log(data);
        this.response = this.WS.inviteUsers({
          invite_to: data,
          workspace_id: this.newWS,
        }).subscribe((result) => {
          this.response = result;

          if (this.response.success) {
            this.GS.notify.toast(this.response.message.success, 1);
            this.ngWizardService.next();
          } else {
            this.GS.notify.toast(this.response.message.error, 0, false);
          }
        });
      }

      case "step6": {
        let data = this.registrationForm.value.talent.talent;
        console.log(data);
        this.response = this.GS.authService
          .userMetaAdd({ meta_key: "talent", meta_value: data })
          .subscribe((result) => {
            this.response = result;
            console.log("<<<<");
            console.log(this.response);
            console.log(">>>>");
            if (this.response.success) {
              this.GS.notify.toast(this.response.message.success, 1);
              this.ngWizardService.next();
            } else {
              this.GS.notify.toast(this.response.data.error, 0, false);
            }
          });
      }
    }
  }

  validate_email(email: any) {
    //ToDO:Call thia from Auth API
    this.authService
      .validate_email(email)
      .pipe(first())
      .subscribe((result) => {
        this.response = result;
        console.log(this.response);
        if (this.response.success == 1) {
          this.ngWizardService.next();
          this.GS.notify.toast("valid Email", 1);
        } else {
          this.GS.notify.toast("invalid Email", 0, false);
        }
      });
  }

  register_user(formdata: any) {
    const registrationSubscr = this.authService
      .registration(formdata)
      .pipe(first())
      .subscribe((user: UserModel) => {
        if (user) {
          this.ngWizardService.next();
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  redirecttodash() {
    this.router.navigate(["/dashboard"]);
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  c_password(g: FormGroup) {
    return g.get("password")?.value === g.get("cpassword")?.value
      ? null
      : { mismatch: true };
  }
  check_mail(email: string) {
    return this.GS.validateEmail(email);
  }

  inviteResolve(g: FormGroup) {
    let val = g.get("invite").value;
    val = val.split("\n");
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (let index = 0; index < val.length; index++) {
      const element = val[index];

      console.log(element);
      //this.check_mail(element);
      if (re.test(element) == false) {
        return { invalid: true };
      }
    }
    return null;
  }
}
