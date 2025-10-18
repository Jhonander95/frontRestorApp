import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarModule, PanelMenuModule, ButtonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/admin'] },
    { label: 'Productos', icon: 'pi pi-box', routerLink: ['/admin/products'] },
    { label: 'Métodos de Pago', icon: 'pi pi-wallet', routerLink: ['/admin/payment-methods'] },
    { label: 'Reportes', icon: 'pi pi-chart-bar', routerLink: ['/admin/reports'] },
    { label: 'Usuarios', icon: 'pi pi-users', routerLink: ['/admin/users'] },
  ];

  logout(): void {
    this.auth.logout();
  }
}
