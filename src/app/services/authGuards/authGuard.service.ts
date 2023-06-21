import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { KeychainService } from '../keychain.service';


@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private keychainService: KeychainService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.keychainService.isLoggedIn()) {

      if (state.url == "/auth" || state.url == "/") {
        this.router.navigate(['/auth/home']);
      }

      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
