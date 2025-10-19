import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/api.service';

/**
 * Servicio para gestionar pedidos (orders) contra la API REST.
 * Endpoint base: /orders
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);
  // Usar trailing slash para evitar redirects (DRF u otros frameworks)
  private readonly baseUrl = '/orders/';

  /** Obtiene todos los pedidos. */
  getAll(): Observable<any[]> {
    return this.api.get<any>(this.baseUrl).pipe(map((res) => res?.data ?? res));
  }

  /** Obtiene un pedido por id, incluye ítems. */
  getOne(id: number): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`).pipe(map((res) => res?.data ?? res));
  }

  /** Crea un nuevo pedido. */
  create(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data).pipe(map((res) => res?.data ?? res));
  }

  /** Actualiza datos del pedido (type, table_number, customer_name, status). */
  update(id: number, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data).pipe(map((res) => res?.data ?? res));
  }

  /** Elimina un pedido. */
  delete(id: number): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`).pipe(map((res) => res?.data ?? res));
  }

  /** Agrega un ítem al pedido. */
  addItem(orderId: number, item: { product_id: number; quantity: number; note?: string }): Observable<any> {
    return this.api
      .post<any>(`${this.baseUrl}${orderId}/items/`, item)
      .pipe(map((res) => res?.data ?? res));
  }

  /** Actualiza cantidad/nota de un ítem (si no está servido/cancelado). */
  updateItem(orderId: number, itemId: number, data: { quantity?: number; note?: string }): Observable<any> {
    return this.api
      .put<any>(`${this.baseUrl}${orderId}/items/${itemId}/`, data)
      .pipe(map((res) => res?.data ?? res));
  }

  /** Elimina un ítem (si no está servido). */
  deleteItem(orderId: number, itemId: number): Observable<any> {
    return this.api
      .delete<any>(`${this.baseUrl}${orderId}/items/${itemId}/`)
      .pipe(map((res) => res?.data ?? res));
  }

  /** Cambia el estado de un ítem (transiciones válidas). */
  updateItemStatus(orderId: number, itemId: number, status: string): Observable<any> {
    return this.api
      .put<any>(`${this.baseUrl}${orderId}/items/${itemId}/status/`, { status })
      .pipe(map((res) => res?.data ?? res));
  }

  /** Cola de cocina (requiere cocina/admin). */
  getKitchenQueue(): Observable<any[]> {
    return this.api.get<any>(`${this.baseUrl}kitchen/queue/`).pipe(map((res) => res?.data ?? res));
  }
}
