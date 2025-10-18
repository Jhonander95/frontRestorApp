import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * RoleGuard: valida que el usuario tenga el rol requerido (admin).
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    if (role === 'admin') return true;
    this.router.navigate(['/auth/login']);
    return false;
  }
}
