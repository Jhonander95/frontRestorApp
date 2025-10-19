import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/api.service';

/**
 * Servicio para gestionar productos contra la API REST.
 * Endpoint base: /products
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);
  private readonly baseUrl = '/products';

  /** Obtiene todos los productos. */
  getAll(): Observable<any[]> {
    return this.api.get<any>(this.baseUrl).pipe(map((res) => res?.data ?? res));
  }

  /** Crea un nuevo producto. */
  create(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data).pipe(map((res) => res?.data ?? res));
  }

  /** Actualiza un producto por ID. */
  update(id: number, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}/${id}`, data).pipe(map((res) => res?.data ?? res));
  }

  /** Elimina un producto por ID. */
  delete(id: number): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}/${id}`).pipe(map((res) => res?.data ?? res));
  }
}
