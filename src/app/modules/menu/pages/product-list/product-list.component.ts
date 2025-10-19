import { Component, OnInit, Signal, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../menu/services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    ProductFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  products = signal<any[]>([]);
  loading = signal<boolean>(false);

  displayForm = signal<boolean>(false);
  editing = signal<boolean>(false);
  currentProduct = signal<any | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar productos' });
      },
    });
  }

  openNew(): void {
    this.editing.set(false);
    this.currentProduct.set(null);
    this.displayForm.set(true);
  }

  openEdit(product: any): void {
    this.editing.set(true);
    this.currentProduct.set(product);
    this.displayForm.set(true);
  }

  onSaved(): void {
    this.displayForm.set(false);
    this.loadProducts();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto guardado' });
  }

  onCancel(): void {
    this.displayForm.set(false);
  }

  confirmDelete(product: any): void {
    this.confirmationService.confirm({
      message: `¿Eliminar "${product?.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteProduct(product),
    });
  }

  private deleteProduct(product: any): void {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado' });
        this.loadProducts();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
      },
    });
  }
}
