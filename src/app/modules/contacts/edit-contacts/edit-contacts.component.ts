import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbTooltip,
  NgbTooltipConfig,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  NgForm,
} from '@angular/forms';
import { ContactService } from '../_service/contact.service';
import { environment } from 'src/environments/environment';

const ASSET_URL = `${environment.assetUrl}`;

@Component({
  selector: 'app-edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['./edit-contacts.component.scss'],
})

export class EditContactsComponent implements OnInit {

  emailFormGroup: FormGroup;
  hasError: boolean;
  emailFieldsGroup: any ;
  emailGroupRows: FormArray;
  contactStatus: any;
  id: any;
  contact: any;
  addressType: any;
  statusValue: string;
  defaultPic: string;


  model: any;
  ContactForm: FormGroup;
  options: any;
  emailBox: FormGroup;
  response: any;
  // @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private CS: ContactService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe((params) => (this.id = params.id));
    this.defaultPic = '../../../assets/media/users/default.jpg';
    this.options = { multiple: true , tags: true};
    this.ContactForm = this.fb.group({
      id: [''],
      profile_image: [''],
      avatar: [''],
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
      })
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
    this.statusValue = 'active';

  }

  ngOnInit(): void {
    this.getContact();
  }

  getContact() {
    this.CS.get(this.id).subscribe((data: any) => {
      if (data.success) {
        this.contact = data.data.contact;
        this.statusValue = this.contact.status;
        console.log(this.contact);
        console.log('Edit Component working');
        this.patchContactForm();
      } else {
        Swal.fire(
          'Oops',
          'Cannot Edit Contact. Wrong Workspace',
          'error'
        ).then(() => {
          this.router.navigateByUrl('/contacts/list').then(() => {
          });
        });
      }
    });
  }

  patchContactForm() {
    this.defaultPic = this.contact.avatar as string;
    this.defaultPic = ASSET_URL + this.defaultPic.replace('public', 'storage');

    this.ContactForm.patchValue({
      id: this.id,
      status: this.contact.status,
      first_name: this.contact.first_name,
      last_name: this.contact.last_name,
      nickname: this.contact.nickname,
      is_public: this.contact.is_public,
      type: this.contact.type,
      group: this.contact.group,
      tag: this.contact.tag,
      personal_phone: this.contact.personal_phone,
      description: this.contact.description,
      company: this.contact.company,
      business: {
        website: this.contact.website,
        fiscal_code: this.contact.fiscal_code,
        vat_number: this.contact.vat_number,
        business_registration: this.contact.business_registration,
        business_phone: this.contact.business_phone,
        business_fax: this.contact.business_fax,
      },
      personal_data: {
        place_of_birth: this.contact.place_of_birth,
        birthday: this.contact.birthday,
        driver_license: this.contact.driver_license,
        height: this.contact.height,
        weight: this.contact.weight,
        bust_size: this.contact.bust_size,
        waist_size: this.contact.waist_size,
        shoes_size: this.contact.shoes_size,
        id_card_type: this.contact.id_card_type,
        id_card_number: this.contact.id_card_number,
        id_card_released_by: this.contact.id_card_released_by,
        id_card_released_on: this.contact.id_card_released_on,
        facebook_profile: this.contact.facebook_profile,
        twitter_profile: this.contact.twitter_profile,
        instagram_profile: this.contact.instagram_profile,
        linkedin_profile: this.contact.linkedin_profile,
        tiktok_profile: this.contact.tiktok_profile,
      }

    });
    this.setEmails();
    this.setAddress();
  }

  setEmails() {
    const control = this.ContactForm.controls.email as FormArray;
    this.contact.email.forEach((x: { [key: string]: any; }) => {
      control.push(this.fb.group(x));
    });
  }

  setAddress() {
    const control = this.ContactForm.controls.address as FormArray;
    this.contact.address.forEach((x: { [key: string]: any; }) => {
      control.push(this.fb.group(x));
    });
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
    this.update_contact(this.id, this.toFormData(this.ContactForm.value));
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

  update_contact(id: any, data: any){
    data.append('workspace_id', this.CS.GS.defualtWS);
    this.CS.update(data).subscribe((result) => {
      this.response = result;
      if (this.response.success){
        Swal.fire(
          'Updated',
          'Contact Updated',
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

}
