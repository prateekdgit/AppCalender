import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts.component';
import { CreateContactsComponent } from './create-contacts/create-contacts.component';
import { ListContactsComponent } from './list-contacts/list-contacts.component';
import { EditContactsComponent } from './edit-contacts/edit-contacts.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    children: [
      {
        path: 'edit/:id',
        component: EditContactsComponent,
      },
      {
        path: 'create',
        component: CreateContactsComponent,
      },
      {
        path: 'list',
        component: ListContactsComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
