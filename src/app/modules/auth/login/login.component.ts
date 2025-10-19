import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Componente de Login de RestorApp.
 * - Standalone con formulario reactivo.
 * - Usa PrimeNG para inputs, botones y toasts.
 * - Realiza login y redirige a /orders al éxito.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  /** Maneja el envío del formulario de login. */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.auth
      .login({ username: username!, password: password! })
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión exitoso' });
          const role = this.auth.getUserRole();
          if (role) {
            if (role === 'admin') {
              this.router.navigateByUrl('/admin');
            } else if (role === 'mesero') {
              this.router.navigateByUrl('/waiter/orders');
            } else {
              this.router.navigateByUrl('/orders');
            }
          } else {
            // Si no hay rol aún, intentar perfil y luego decidir
            this.auth.getProfile().subscribe({
              next: () => {
                const fetchedRole = this.auth.getUserRole();
                if (fetchedRole === 'admin') {
                  this.router.navigateByUrl('/admin');
                } else if (fetchedRole === 'mesero') {
                  this.router.navigateByUrl('/waiter/orders');
                } else {
                  this.router.navigateByUrl('/orders');
                }
              },
              error: () => {
                this.router.navigateByUrl('/orders');
              },
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          let detail = 'No se pudo iniciar sesión';
          const apiMessage = (err?.error as any)?.message ?? (err?.error as any)?.detail;

          if (err.status === 0) {
            // Error de red o servidor caído
            detail = 'No se pudo conectar con el servidor. Verifica que el backend esté en http://localhost:8000';
          } else if (err.status === 401) {
            // Credenciales inválidas u no autorizado
            detail = apiMessage || 'Credenciales inválidas';
          } else if (apiMessage) {
            // Mensaje específico desde la API
            detail = apiMessage;
          } else if (err.message) {
            // Mensaje genérico del HttpErrorResponse
            detail = err.message;
          }

          this.messageService.add({ severity: 'error', summary: 'Error de autenticación', detail });
        },
      });
  }
}
