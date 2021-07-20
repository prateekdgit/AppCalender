import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { WorkspaceService } from '../_service/workspace.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-workspace',
  templateUrl: './list-workspace.component.html',
  styleUrls: ['./list-workspace.component.scss']
})
export class ListWorkspaceComponent implements 
  OnInit,
  OnChanges  {
  @ViewChild('workspace', {static: true}) usernameElement: ElementRef;  
  @ViewChild('model', { static: true }) modelElement: ElementRef;



  //dataSource = ELEMENT_DATA;
  response:any;
  Wlist:[];
  closeResult: string;
  workspace:string = '';
  model:any;
  //isLoad = false;
  joinKey:any="";
  constructor(private route: ActivatedRoute, private WS:WorkspaceService,private cd: ChangeDetectorRef,private modalService: NgbModal) {
    this.route.params.subscribe((params) => {      
      if (params.key) {
        this.joinWorkspace(params.key);
      }
      console.log(params);
    });
  }

  ngOnInit(){  
    this.get_list();
    
  }
  noworkspacecheck(){
    this.WS.GS.notify.toast("Please Create atleast One Workspace to Use all feature", 2, false,3000);
  }
  joinWorkspace(joinKey:string){
    this.WS.join({token:joinKey}).subscribe((result) => {
      this.response = result;
      if (this.response.success) {
        this.get_list();
        //this.modalService.dismissAll();
        this.WS.GS.notify.toast(this.response.message, 1, false);
      } else {
        this.WS.GS.notify.toast("Something Went Wronge", 0, false);
      }
    })
  }
  // get_list(){
  //   this.WS.list().subscribe((result) => {
  //     this.response = result;
  //     if(this.response.success){
  //       this.Wlist = this.response.data.workspace;
  //       //this.WS.GS.reloadComponent();
  //     }else{
  //       this.WS.GS.notify.toast("No Workspace Found !!",0);
  //     }
  //   });
  // }

  get_list(){
    this.WS.list().then((result)=>{
      this.response = result;
      console.log("promess") ;
      console.log(this.response);
      if(this.response.success){
        this.WS.currentWorkspaces = this.response.data.workspace;
        this.Wlist = this.WS.currentWorkspaces;
        this.cd.markForCheck();      
        if(this.Wlist.length == 0){
          this.noworkspacecheck();
        }  
      }else{
        this.WS.GS.notify.toast("No Workspace Found !!",0);
      }
    });
  }

  ngOnChanges() {
    console.log("asasasas");
  } 



  open(content) {
    this.modalService.open(content).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return  `with: ${reason}`;
    }
}

create_workspace(name:string){
  console.log(name);
  
  this.WS.create(name).subscribe((result)=>{
    this.response = result;
    if(this.response.success){
      this.get_list();
      this.modalService.dismissAll();

      this.WS.GS.notify.toast("Workspace Created",1,false);      
    }else{
      this.WS.GS.notify.toast("Something Went Wronge",0,false);
    }
  })
}

delete_workspace(workspace){
  Swal.fire({
    title: 'Are you sure?',
    text: 'You want to Delete "'+workspace.name+'"',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.WS.delete(workspace.id).subscribe((result) => {
        this.response = result;
        if(this.response.success){
          this.get_list();
          Swal.fire(
            'Deleted!',
            'Your "'+workspace.name+'" workspace has been deleted.',
            'success'
          );

        }else{
          Swal.fire(
            'Oops!',
            this.response.data.error,
            'error'
          );
        }
      });
    // For more information about handling dismissals please visit
    // https://sweetalert2.github.io/#handling-dismissals
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Action Cancelled',
        'Your "'+workspace.name+'" is safe :)',
        'error'
      )
    }
  });
}

}

// export interface Element {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
// const ELEMENT_DATA: Element[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];

