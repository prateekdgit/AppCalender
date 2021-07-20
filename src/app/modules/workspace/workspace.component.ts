import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
constructor() { }
  

   ngOnInit(): void {
    // setTimeout(() => {
    //   this.subheader.setTitle('Work Space');
    //   this.subheader.setBreadcrumbs([{
    //     title: 'workspace',
    //     linkText: 'Work workspace',
    //     linkPath: '/workspace'
    //   }]);
    // }, 1);
  }

}
