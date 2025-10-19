import { Component, EventEmitter, Output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../menu/services/product.service';
import { OrderService } from '../../services/order.service';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, TableModule, ButtonModule, InputNumberModule, ToastModule, PaymentSelectorComponent],
  providers: [MessageService],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  // Modelo de pedido (no signal para permitir [(ngModel)])
  order: { customer_name: string; type: string; items: any[]; payments: any[] } = {
    customer_name: '',
    type: 'mesa',
    items: [],
    payments: [],
  };

  orderTypes = [
    { label: 'Mesa', value: 'mesa' },
    { label: 'Domicilio', value: 'domicilio' },
    { label: 'Para llevar', value: 'para_llevar' },
  ];

  products = signal<any[]>([]);

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (list) => this.products.set(Array.isArray(list) ? list : []),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar productos' }),
    });
  }

  addItem(product: any): void {
    const items = [...this.order.items];
    items.push({ product_id: product.id, name: product.name, price: product.price, quantity: 1, note: '', subtotal: product.price });
    this.order.items = items;
  }

  removeItem(index: number): void {
    const items = [...this.order.items];
    items.splice(index, 1);
    this.order.items = items;
  }

  onItemChange(): void {
    this.order.items = this.order.items.map((it: any) => ({ ...it, subtotal: (it.quantity || 0) * (it.price || 0) }));
  }

  getTotal(): number {
    return this.order.items.reduce((sum: number, it: any) => sum + (it.subtotal || 0), 0);
  }

  onPaymentsChange(payments: any[]): void {
    this.order.payments = payments || [];
  }

  saveOrder(): void {
    const total = this.getTotal();
    const paid = (this.order.payments || []).reduce((s: number, p: any) => s + (p.amount || 0), 0);
    if (total <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Agrega al menos un producto' });
      return;
    }
    if (Math.round((paid - total) * 100) / 100 !== 0) {
      this.messageService.add({ severity: 'warn', summary: 'Pagos', detail: 'La suma de pagos debe ser igual al total' });
      return;
    }

    const payload = {
      customer_name: this.order.customer_name,
      type: this.order.type,
      items: this.order.items.map((it: any) => ({ product_id: it.product_id, quantity: it.quantity, note: it.note })),
      payments: this.order.payments.map((p: any) => ({ method_id: p.method_id, amount: p.amount })),
      total,
    };

    this.orderService.create(payload).subscribe({
      next: () => this.saved.emit(),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el pedido' }),
    });
  }

  close(): void {
    this.closed.emit();
  }
}
