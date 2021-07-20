import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkspaceService } from './workspace.service';
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class HaveWorkspaceGuard implements CanActivate {
  constructor(private WS: WorkspaceService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.WS.currentWorkspaces != undefined &&
      this.WS.currentWorkspaces.length > 0
    ) {
      return true;
    }
    this.router.navigate(["/workspace"]);
    return false;
  }
}
