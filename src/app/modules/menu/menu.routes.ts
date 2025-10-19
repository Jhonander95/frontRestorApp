import { Routes } from '@angular/router';
// Rutas del módulo de productos (menu)
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then(m => m.ProductListComponent),
  },
];
