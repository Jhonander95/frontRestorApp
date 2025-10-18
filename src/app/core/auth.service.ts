import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Servicio de autenticación para gestionar sesión con JWT.
 * - Realiza login contra la API.
 * - Persiste el token en localStorage.
 * - Expone utilidades para estado de sesión y rol de usuario.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  /** Clave usada para almacenar el token JWT en localStorage. */
  private readonly TOKEN_KEY = 'restorapp_token';
  /** Clave para almacenar el rol del usuario (si la API lo retorna). */
  private readonly ROLE_KEY = 'restorapp_role';

  /**
   * Inicia sesión con credenciales de usuario.
   * Espera recibir un JWT en la respuesta.
   */
  login(credentials: { username: string; password: string }): Observable<string> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      map((res) => {
        // Se asume respuesta estándar { success, message, data }
        const token =
          res?.data?.access_token ??
          res?.access_token ??
          res?.data?.token ??
          res?.token ??
          '';
        const role = res?.data?.role ?? res?.role ?? null;
        if (!token) throw new Error('Token no recibido');
        this.saveToken(token);
        if (role) this.saveRole(role);
        return token;
      })
    );
  }

  /** Cierra la sesión y limpia el almacenamiento. */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigateByUrl('/auth/login');
  }

  /** Guarda el token JWT en localStorage. */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Obtiene el token desde localStorage. */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Retorna true si existe un token. */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Guarda el rol del usuario si aplica. */
  private saveRole(role: string): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  /** Obtiene el rol del usuario. */
  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }
}
