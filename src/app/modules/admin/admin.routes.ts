import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from '../../core/role.guard';

/**
 * Rutas del módulo de administración.
 */
export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', loadChildren: () => import('../menu/menu.routes').then(m => m.routes) },
      { path: 'payment-methods', loadChildren: () => import('../payments/payments.routes').then(m => m.routes) },
      { path: 'reports', loadChildren: () => import('../reports/reports.routes').then(m => m.routes) },
      { path: 'users', loadChildren: () => import('../users/users.routes').then(m => m.routes) },
    ],
  },
];
