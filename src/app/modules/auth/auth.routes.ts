import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

/**
 * Rutas del módulo de autenticación (lazy loaded desde `app.routes.ts`).
 */
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
