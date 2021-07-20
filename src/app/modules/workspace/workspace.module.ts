import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';

// Data table
//import {MatPaginator} from '@angular/material/paginator';
//import { MatSort } from '@angular/material/sort';/*
 //import {MatTableDataSource} from '@angular/material/MatTableDataSource';*/

import { MatRadioModule } from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
//import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
//import { MatTableDataSource } from '@angular/material/table';
import { InlineSVGModule } from 'ng-inline-svg';
import { DetailsWorkspaceComponent } from './details-workspace/details-workspace.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgbTooltipModule,NgbTooltipConfig,NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
  //NgbModule,
  WorkspaceComponent, 
  ListWorkspaceComponent, 
  DetailsWorkspaceComponent,
  ],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    WorkspaceRoutingModule,
    InlineSVGModule, 
    MatTableModule, 
    MatButtonModule,  
 //   MatPaginator, 
  //  MatSort, 
   /* MatTableDataSource,*/
    MatRadioModule,
    MatDialogModule,
    //NgbTooltipModule,
    //MatIconRegistry,
    //MatIconModule,
    InlineSVGModule,
    MatInputModule,
    
    
  ],


  
})
export class WorkspaceModule { }
