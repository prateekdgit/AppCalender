import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactsRoutingModule } from './contacts-routing.module';
import { CreateContactsComponent } from './create-contacts/create-contacts.component';
import { ContactsComponent } from './contacts.component';
import { ListContactsComponent } from './list-contacts/list-contacts.component';

import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgSelect2Module } from 'ng-select2';
import { MatButtonModule } from '@angular/material/button';
import { EditContactsComponent } from './edit-contacts/edit-contacts.component';
@NgModule({
  declarations: [ ContactsComponent, CreateContactsComponent, ListContactsComponent, EditContactsComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InlineSVGModule,
    NgSelect2Module,
    MatButtonModule
  ]
})
export class ContactsModule { }
