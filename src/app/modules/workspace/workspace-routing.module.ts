import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { DetailsWorkspaceComponent } from './details-workspace/details-workspace.component';
import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';
import { WorkspaceComponent } from './workspace.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: 'details/:id',
        component: DetailsWorkspaceComponent,
      },
      {
        path: 'list',
        component: ListWorkspaceComponent,
      },
      {
        path: 'join/:key',
        component: ListWorkspaceComponent,
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
export class WorkspaceRoutingModule { }
