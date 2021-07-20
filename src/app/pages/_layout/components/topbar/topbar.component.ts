import { Component, OnInit, AfterViewInit ,ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../_metronic/core';
import { AuthService } from '../../../../modules/auth/_services/auth.service';
import { UserModel } from '../../../../modules/auth/_models/user.model';
import KTLayoutQuickSearch from '../../../../../assets/js/layout/extended/quick-search';
import KTLayoutQuickNotifications from '../../../../../assets/js/layout/extended/quick-notifications';
import KTLayoutQuickActions from '../../../../../assets/js/layout/extended/quick-actions';
import KTLayoutQuickCartPanel from '../../../../../assets/js/layout/extended/quick-cart';
import KTLayoutQuickPanel from '../../../../../assets/js/layout/extended/quick-panel';
import KTLayoutQuickUser from '../../../../../assets/js/layout/extended/quick-user';
import KTLayoutHeaderTopbar from '../../../../../assets/js/layout/base/header-topbar';
import { KTUtil } from '../../../../../assets/js/components/util';
// import { gService } from "../../../../globalServices/g.service";
import {WorkspaceService} from "../../../../modules/workspace/_service/workspace.service";
import { finalize } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit, AfterViewInit {
  //@ViewChild('defualtWS', {static: true}) metselect: ElementRef;
  user$: Observable<UserModel>;
  // tobbar extras
  extraSearchDisplay: boolean;
  extrasSearchLayout: "offcanvas" | "dropdown";
  extrasNotificationsDisplay: boolean;
  extrasNotificationsLayout: "offcanvas" | "dropdown";
  extrasQuickActionsDisplay: boolean;
  extrasQuickActionsLayout: "offcanvas" | "dropdown";
  extrasCartDisplay: boolean;
  extrasCartLayout: "offcanvas" | "dropdown";
  extrasQuickPanelDisplay: boolean;
  extrasLanguagesDisplay: boolean;
  extrasUserDisplay: boolean;
  extrasUserLayout: "offcanvas" | "dropdown";
  Wlist={};
  response:any;
  defualtWS:number;
  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    public WS: WorkspaceService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe((data) => {
      this.defualtWS = Number(data.usermeta.defualtWS);
    });
  }

  ngOnInit(): void {

    // topbar extras
    this.extraSearchDisplay = this.layout.getProp("extras.search.display");
    this.extrasSearchLayout = this.layout.getProp("extras.search.layout");
    this.extrasNotificationsDisplay = this.layout.getProp(
      "extras.notifications.display"
    );
    this.extrasNotificationsLayout = this.layout.getProp(
      "extras.notifications.layout"
    );
    this.extrasQuickActionsDisplay = this.layout.getProp(
      "extras.quickActions.display"
    );
    this.extrasQuickActionsLayout = this.layout.getProp(
      "extras.quickActions.layout"
    );
    this.extrasCartDisplay = this.layout.getProp("extras.cart.display");
    this.extrasCartLayout = this.layout.getProp("extras.cart.layout");
    this.extrasLanguagesDisplay = this.layout.getProp(
      "extras.languages.display"
    );
    this.extrasUserDisplay = this.layout.getProp("extras.user.display");
    this.extrasUserLayout = this.layout.getProp("extras.user.layout");
    this.extrasQuickPanelDisplay = this.layout.getProp(
      "extras.quickPanel.display"
    );
    this.get_list();
  }

  ngAfterViewInit(): void {
    KTUtil.ready(() => {
      // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      // Add 'implements AfterViewInit' to the class.
      if (this.extraSearchDisplay && this.extrasSearchLayout === "offcanvas") {
        KTLayoutQuickSearch.init("kt_quick_search");
      }

      if (
        this.extrasNotificationsDisplay &&
        this.extrasNotificationsLayout === "offcanvas"
      ) {
        // Init Quick Notifications Offcanvas Panel
        KTLayoutQuickNotifications.init("kt_quick_notifications");
      }

      if (
        this.extrasQuickActionsDisplay &&
        this.extrasQuickActionsLayout === "offcanvas"
      ) {
        // Init Quick Actions Offcanvas Panel
        KTLayoutQuickActions.init("kt_quick_actions");
      }

      if (this.extrasCartDisplay && this.extrasCartLayout === "offcanvas") {
        // Init Quick Cart Panel
        KTLayoutQuickCartPanel.init("kt_quick_cart");
      }

      if (this.extrasQuickPanelDisplay) {
        // Init Quick Offcanvas Panel
        KTLayoutQuickPanel.init("kt_quick_panel");
      }

      if (this.extrasUserDisplay && this.extrasUserLayout === "offcanvas") {
        // Init Quick User Panel
        KTLayoutQuickUser.init("kt_quick_user");
      }

      // Init Header Topbar For Mobile Mode
      KTLayoutHeaderTopbar.init("kt_header_mobile_topbar_toggle");
    });
  }
  get_list() {
    this.WS.list().then((result) => {
      this.WS.response = result;
      console.log("<<<get_list");
      console.log(this.WS.response);
      if (this.WS.response.success) {

        this.WS.currentWorkspaces = this.WS.response.data.workspace;        
        this.cd.markForCheck();


        let All = [];
        console.log(this.WS.currentWorkspaces.length);
        if(this.WS.currentWorkspaces.length > 0){
          this.WS.currentWorkspaces.forEach(element => {
            All.push(element.id);
          });
          console.log(All);
          console.log(All.indexOf(this.defualtWS));
          if(All.indexOf(this.defualtWS) == -1) {
            console.log('notfound');
            this.defualtWSF({value:this.WS.currentWorkspaces[0].id});  
          }
        }else if (this.WS.currentWorkspaces.length > 0 && this.defualtWS != undefined && this.defualtWS == 0){
          this.defualtWSF({value:this.WS.currentWorkspaces[0].id});
        }

        this.WS.GS.authService.getUserByToken().subscribe((finalize) => {
          this.cd.markForCheck();
        });
        
      } else {
        this.WS.GS.notify.toast("No Workspace Found !!", 0);
      }
    });
  }
  
  defualtWSF(event:any){
    console.log("event");
    console.log(event.value);
    this.auth.userMetaAdd({ "meta_key": 'defualtWS', "meta_value": event.value }).subscribe((result) => {
      this.response = result;
      if (this.response.success) {
        this.WS.GS.defualtWS = event.value;
        this.cd.markForCheck();
        this.refreshComponent();
      } else {
        this.WS.GS.notify.toast(this.response.data.error, 0, false);
      }
    });
  }

  refreshComponent(){
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
      });
  }
}
