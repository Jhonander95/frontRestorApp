import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { OrderFormComponent } from '../../components/order-form/order-form.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TableModule, ButtonModule, DialogModule, ToastModule, OrderFormComponent],
  providers: [MessageService],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);

  orders = signal<any[]>([]);
  displayForm = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (data) => this.orders.set(Array.isArray(data) ? data : []),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar pedidos' }),
    });
  }

  showForm(): void {
    this.displayForm.set(true);
  }

  onSaved(): void {
    this.displayForm.set(false);
    this.loadOrders();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido creado' });
  }

  onClosed(): void {
    this.displayForm.set(false);
  }
}
