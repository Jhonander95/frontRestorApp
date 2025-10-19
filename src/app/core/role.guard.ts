import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * RoleGuard: valida que el usuario tenga el rol requerido (admin).
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getUserRole();
    const allowed: string[] = route.data?.['roles'] ?? [];

    if (role && (allowed.length === 0 || allowed.includes(role))) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
