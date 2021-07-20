import { FormsModule } from '@angular/forms';
import {ContactService} from '../_service/contact.service';
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
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit {
  response: any;
  Clist: [];
  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private CS: ContactService, private router: Router) { }

  ngOnInit(): void {
    this.get_list();
  }
  get_list(){
    this.CS.list().subscribe((result) => {
      this.response = result;
      console.log(this.response);
      if (this.response.success) {
        this.Clist = this.response.data.contact;
        this.cd.markForCheck();
        this.CS.GS.notify.toast('Contact List', 1);
      }else{
        this.cd.markForCheck();
        Swal.fire(
          'Oops',
          'No Contacts Found!',
          'error'
        ).then(() => {
          this.router.navigateByUrl('/dashboard');
        });
      }
    });
  }
  delete(contact){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Delete "' + contact.name + '"',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // tslint:disable-next-line:no-shadowed-variable
        this.CS.delete(contact.id).subscribe((result) => {
          this.response = result;
          console.log('deleted');
          console.log(this.response);
          if (this.response.success){
            this.get_list();
            Swal.fire(
              'Deleted!',
              'Your "' + contact.name + '" contact has been deleted.',
              'success'
            );
          }else{
            console.log(this.response.data.error);
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
          'Your "' + contact.first_name + ' ' + contact.last_name + '" is safe :)',
          'error'
        );
      }
    });
  }
}
