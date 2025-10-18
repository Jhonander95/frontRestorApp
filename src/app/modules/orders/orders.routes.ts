import { Routes } from '@angular/router';
import { OrdersPageComponent } from './orders-page.component';
import { authGuard } from '../../core/auth.guard';

/**
 * Rutas del módulo de pedidos (placeholder por ahora).
 */
export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: OrdersPageComponent,
  },
];
