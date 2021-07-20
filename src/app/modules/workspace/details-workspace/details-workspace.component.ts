import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
  ElementRef,
} from "@angular/core";
import { WorkspaceService } from "../_service/workspace.service";
import {
  NgbModal,
  ModalDismissReasons,
  NgbTooltip,
  NgbTooltipConfig,
} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  NgForm,
} from "@angular/forms";

@Component({
  selector: "app-details-workspace",
  templateUrl: "./details-workspace.component.html",
  styleUrls: ["./details-workspace.component.scss"],
  //providers: [NgbTooltipConfig] // add NgbTooltipConfig to the component providers
})
export class DetailsWorkspaceComponent implements OnInit {
  userRoles = {};
  id: any;
  //dataSource = ELEMENT_DATA;
  response: any;
  Wlist: [];
  closeResult: string;
  workspace: string = "";
  invite = false;
  //isLoad = false;

  addForm: FormGroup;

  rows: FormArray;
  itemForm: FormGroup;
  short_form: any;
  constructor(
    //private config:NgbTooltipConfig,
    private route: ActivatedRoute,
    private WS: WorkspaceService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder //public tooltip: NgbTooltip
  ) {
    // this.config.placement = 'top';
    // this.config.triggers = 'click';

    this.route.params.subscribe((params) => (this.id = params.id));
    console.log(this.id);
    this.short_form = {
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      role: ["", Validators.required],
    };

    this.addForm = this.fb.group(this.short_form);

    this.rows = this.fb.array([]);
  }

  ngOnInit(): void {
    this.getDetail();
    this.getRoles();
    this.addForm = this.fb.group(this.short_form);
    this.addForm.addControl("rows", this.rows);
    this.rows.push(this.createItemFormGroup());
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
  getDetail() {
    this.WS.get(this.id).then((result) => {
      this.response = result;
      console.log("promess");
      console.log(this.response);
      if (this.response.success) {
        this.Wlist = this.response.data;
        this.cd.markForCheck();
      } else {
        this.WS.GS.notify.toast("Workspace Not Found !!", 0, false);
      }
    });
  }
  inviteUser(email: string) {
    this.response = this.WS.inviteUsers({
      invite_to: email,
      workspace_id: this.id,
    }).subscribe((result) => {
      this.response = result;

      if (this.response.success) {
        this.getDetail();
        this.modalService.dismissAll();
        this.WS.GS.notify.toast(this.response.message.success, 1, false);
      } else {
        this.WS.GS.notify.toast(this.response.message.error, 0, false);
      }
    });
  }

  inviteAllUser() {
    console.log(this.rows.value);
    console.log(this.rows);
    console.log(this.addForm);    
    this.inviteUser(this.rows.value);
  }

  check_email(email:string) {
    console.log(email);
    this.invite = this.WS.GS.validateEmail(email);
  }

  removeUser(user: any) {
    Swal.fire({
      title: "Are you sure?",
      text: 'You want to Delete "' + user.invite_to + '"',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        this.WS.removeUser({ id: user.id, workspace_id: this.id }).subscribe(
          (result) => {
            this.response = result;
            if (this.response.success) {
              this.getDetail();
              Swal.fire(
                "Deleted!",
                'Your "' + user.invite_to + '" User removed from workspace.',
                "success"
              );
            } else {
              Swal.fire("Oops!", "Something wnet wrong !!", "error");
            }
          }
        );

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Action Cancelled",
          'Your "' + user.invite_to + '" is safe :)',
          "error"
        );
      }
    });
  }

  open(content) {
    this.modalService.open(content).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // inviteResolve(email:string){
  //   let val = g.get('invite').value;
  //   val = val.split("\n");
  //   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //   for (let index = 0; index < val.length; index++) {
  //     const element = val[index];

  //       console.log(element);
  //       //this.check_mail(element);
  //       if(re.test(element) == false){
  //         return {'invalid':true};
  //       }

  //   }
  //   return null;
  // }

  onAddRow() {
    console.log("asdasd");

    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group(this.short_form);
  }
  copyClip(v: string) {
    this.WS.GS.copy(this.WS.GS.ENV.baseUrl + "/workspace/join/" + v);
  }
}
