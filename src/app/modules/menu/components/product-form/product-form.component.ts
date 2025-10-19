import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProductService } from '../../../menu/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, InputSwitchModule, InputTextareaModule, ButtonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  @Input() value: any | null = null; // Producto a editar (o null para crear)
  @Output() saved = new EventEmitter<any>(); // Emite cuando se guarda correctamente
  @Output() cancel = new EventEmitter<void>(); // Emite cuando se cancela

  form = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    available: [true, []],
    category: [''],
    description: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const v = this.value ?? { name: '', price: 0, available: true, category: '', description: '' };
      this.form.reset({
        name: v.name ?? '',
        price: v.price ?? 0,
        available: v.available ?? true,
        category: v.category ?? '',
        description: v.description ?? '',
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.value?.id) {
      this.productService.update(this.value.id, payload).subscribe({
        next: (res) => this.saved.emit(res),
        error: () => this.saved.emit(null), // el padre mostrará el toast de error
      });
    } else {
      this.productService.create(payload).subscribe({
        next: (res) => this.saved.emit(res),
        error: () => this.saved.emit(null),
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
