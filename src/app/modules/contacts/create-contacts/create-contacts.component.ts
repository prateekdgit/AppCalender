import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  NgForm } from '@angular/forms';
import {  FormControl, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {ContactService} from '../_service/contact.service';
// import { LayoutService } from '../../_metronic/core';

// import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-create-contacts',
  templateUrl: './create-contacts.component.html',
  styleUrls: ['./create-contacts.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CreateContactsComponent implements OnInit, AfterViewInit {
  emailFormGroup: FormGroup;
  hasError: boolean;
  emailFieldsGroup: any ;
  emailGroupRows: FormArray;
  contactStatus: any;
  defaultPic: string;

  addressType: any;
  avatar: File;

  model: any;
  ContactForm: FormGroup;
  options: any;
  emailBox: FormGroup;
  response: any;
  // @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;
  constructor( private el: ElementRef, private fb: FormBuilder, private CS: ContactService, private router: Router) {
    this.options = { multiple: true , tags: true };
    this.defaultPic = '../../../assets/media/users/default.jpg';

    this.ContactForm = this.fb.group({
      avatar: [''],
      profile_image: [''],
      status: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      nickname: [''],
      is_public: [''],
      type: [''],
      group: [''],
      tag: [''],
      personal_phone: ['', Validators.pattern('^([0|\+[0-9]{1,3})?([1-9][0-9]{9})$')],
      description: [''],
      company: [''],
      email: this.fb.array([]),
      business: this.fb.group({
        website: [''],
        fiscal_code: [''],
        vat_number: [''],
        business_registration: [''],
        business_phone: ['', Validators.pattern('^([0|\+[0-9]{1,3})?([1-9][0-9]{9})$')],
        business_fax: [''],
      }),
      address: this.fb.array([]),
      personal_data: this.fb.group({
        place_of_birth: [ ''],
        birthday: [ ''],
        driver_license: [''],
        height: [''],
        weight: [''],
        bust_size: [''],
        waist_size: [''],
        shoes_size: [''],
        id_card_type: [''],
        id_card_number: [''],
        id_card_released_by: [''],
        id_card_released_on: [''],
        facebook_profile: [''],
        twitter_profile: [''],
        instagram_profile: [''],
        linkedin_profile: [''],
        tiktok_profile: [''],
      }),
      legitimate_interest: [''],
      privacy_policy: [''],
      consent_to_communicate: [''],
      consent_to_process_data: [''],
    });

    /*tab::Contact*/
    this.contactStatus = [
      { id: 1, text: 'active' },
      { id: 2, text: 'closed' },
      { id: 3, text: 'transfered' },
      { id: 4, text: 'failed' },
      { id: 5, text: 'suspended' },
      { id: 6, text: 'canceled' },
    ];
    this.addressType = [
      { id: 1, text: 'personal' },
      { id: 2, text: 'office' },
      { id: 3, text: 'private' },
      { id: 4, text: 'vacation' },
    ];

  }
  ngOnInit(): void {

  }


  // Multi fileds email
  email(): FormArray {
    return this.ContactForm.get('email') as FormArray;
  }
  newEmail(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      type: ['', Validators.required],
      is_primary: [''],
      opted_out: [''],
    });
  }
  addEmail() {
    console.log(this.newEmail());
    this.email().push(this.newEmail());
  }
  removeEmail(i: number) {
    this.email().removeAt(i);
  }
// Multi fileds email
// Multi fileds Address
address(): FormArray {
  return this.ContactForm.get('address') as FormArray;
}
newAddress(): FormGroup {
  return this.fb.group({
    type: ['', Validators.required],
    street: ['', Validators.required],
    city: [''],
    postal_code: [''],
    state: [''],
    country: [''],
    description: [''],
  });
}
addAddress() {
  console.log(this.newAddress());
  this.address().push(this.newAddress());
}
removeAddress(i: number) {
  this.address().removeAt(i);
}
// Multi fileds Address


  submitForm(){
    // this.ContactForm.value;
    console.log(this.ContactForm.value);
    // console.log(this.toFormData(this.ContactForm.value));
    this.create_contact(this.toFormData(this.ContactForm.value));
  }

  toFormData<T>( formValue: T ) {

    const formData = new FormData();

    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value instanceof Object) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }

    return formData;
  }

  create_contact(data: any){
    console.log(data);
    data.append('workspace_id', this.CS.GS.defualtWS);
    this.CS.create(data).subscribe((result) => {
      this.response = result;
      if (this.response.success){
        Swal.fire(
          'Created!',
          'Contact Created',
          'success'
        ).then(() => {
          this.router.navigateByUrl('/contacts/list');
        });
      }else{
        const d = this.response.data.error;
        console.log(d);
        this.CS.GS.notify.toast(d, 0);

      }
    });
  }
  setActiveTab(tabId: number) {
    console.log(this.activeTabId, tabId);
    this.activeTabId = tabId;
  }

  getActiveTabCSSClass(tabId: number) {
    if (tabId !== this.activeTabId) {
      return '';
    }

    return 'active';
  }

  resetPreview(): void {
  //  this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
  //  this.layout.setConfig(this.model);
    location.reload();
  }

  onFileChanged(event) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        // this.avatar = event.target.files[0] as File;
        const file = event.target.files[0] as File;
        // console.log(this.avatar);
        this.ContactForm.patchValue({
          avatar: file
        });
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = document.getElementById('profilepic');
            img.getAttributeNode('src').value = reader.result as string;
        };
    }
  }

  ngAfterViewInit() {
    // init code preview examples
    // see /src/assets/js/layout/extended/examples.js
    const elements = this.el.nativeElement.querySelectorAll('.example');
  //  KTLayoutExamples.init(elements);
  }


}
