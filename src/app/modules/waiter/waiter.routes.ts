import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/role.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: { roles: ['mesero'] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'orders' },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/order-list.component').then((m) => m.OrderListComponent),
      },
    ],
  },
];
