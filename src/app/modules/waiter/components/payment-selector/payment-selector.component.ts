import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../core/api.service';

@Component({
  selector: 'app-payment-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputNumberModule, ButtonModule],
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.scss'],
})
export class PaymentSelectorComponent {
  private readonly api = inject(ApiService);

  @Input() total: number = 0;
  @Input() payments: Array<{ method_id: number | null; amount: number } > = [];
  @Output() paymentsChange = new EventEmitter<Array<{ method_id: number | null; amount: number }>>();

  paymentMethods = signal<any[]>([]);

  constructor() {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.api.get<any>('/payment-methods').subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        this.paymentMethods.set(
          Array.isArray(data)
            ? data.map((m: any) => ({ label: m.name ?? m.method ?? m.id, value: m.id }))
            : []
        );
      },
      error: () => {
        this.paymentMethods.set([]);
      },
    });
  }

  addPayment(): void {
    this.payments = [...this.payments, { method_id: null, amount: 0 }];
    this.paymentsChange.emit(this.payments);
  }

  removePayment(index: number): void {
    const next = [...this.payments];
    next.splice(index, 1);
    this.payments = next;
    this.paymentsChange.emit(this.payments);
  }

  totalPayments(): number {
    return (this.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  }
}
