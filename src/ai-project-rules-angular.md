# 🤖 Reglas de desarrollo asistido por IA — RestorApp Frontend

## 🧠 Contexto general
El proyecto **RestorApp Frontend** es una aplicación **Angular 17** moderna, creada con la intención de ser **modular, mantenible y escalable**, usando:
- **Standalone Components**
- **Feature Modules** para agrupar funcionalidades
- **Lazy Loading** en cada módulo
- **PrimeNG** como librería de UI
- **SCSS** como motor de estilos
- **Angular Signals** y sintaxis moderna (`@for`, `@if`, `@defer`)

El objetivo es que cada feature sea un módulo autocontenido, con su propio enrutamiento, componentes y servicios.

---

## ⚙️ Estructura base esperada
src/app/
│
├── core/ # servicios globales (auth, api, guards)
│ ├── auth.service.ts
│ ├── api.service.ts
│ ├── auth.guard.ts
│ └── interceptors/
│
├── shared/ # componentes, pipes y directivas reutilizables
│ ├── components/
│ ├── pipes/
│ └── directives/
│
├── modules/ # features principales (cada una es un módulo)
│ ├── auth/ # login y registro
│ ├── menu/ # productos
│ ├── orders/ # pedidos
│ ├── payments/ # pagos
│ ├── reports/ # reportes
│ └── settings/ # configuración, licencia, usuarios
│
└── app.routes.ts # rutas principales (lazy loaded)

yaml
Copiar código

---

## 🧩 Reglas generales de desarrollo

1. **Usar Standalone Components** por defecto.
   ```typescript
   @Component({
     standalone: true,
     imports: [CommonModule, FormsModule],
     selector: 'app-example',
     templateUrl: './example.component.html',
     styleUrls: ['./example.component.scss'],
   })
   export class ExampleComponent {}
Cada feature debe tener su propio módulo con routes.ts y index.ts:

bash
Copiar código
/modules/orders/
├── pages/
├── components/
├── services/
├── orders.routes.ts
└── index.ts
Lazy Loading obligatorio
Cada feature se carga bajo demanda:

typescript
Copiar código
export const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () =>
      import('./modules/orders/orders.routes').then(m => m.routes),
  },
];
Routing modular dentro de cada feature
Cada módulo debe exportar sus propias rutas y componentes standalone.

Servicios deben ser providedIn: 'root' salvo que sean específicos del módulo.

Usar Signals o RxJS según convenga.

Signals para estado local o UI reactiva simple.

RxJS para streams de datos (peticiones HTTP, eventos).

Sintaxis moderna Angular 17

@for en lugar de *ngFor

@if en lugar de *ngIf

@defer para carga diferida

Ejemplo:

html
Copiar código
@for (item of products; track item.id) {
  <app-product-card [data]="item" />
}
@if (loading) {
  <p>Cargando...</p>
}
Uso de PrimeNG

Componentes de UI principales (tables, dialogs, dropdowns, etc.).

Importarlos en los standalone components cuando se necesiten:

typescript
Copiar código
imports: [CommonModule, TableModule, ButtonModule]
Manejo de estado

Preferir servicios con Signals (signal()) para compartir estado simple.

Si se requiere más adelante, integrar NgRx o Angular Signals Store.

Consumo de API

Servicio global ApiService en /core/api.service.ts.

Cargar la URL base desde environment.ts.

Autenticación vía JWT con AuthInterceptor.

Protección de rutas

AuthGuard revisa si hay token.

RoleGuard (opcional) valida roles específicos (admin, mesero, cocina).

Convenciones de nombres

Componentes: PascalCase (OrderListComponent)

Archivos: kebab-case (order-list.component.ts)

Variables y funciones: camelCase

Respuestas API

Usar la estructura estándar { success, message, data }.

Los servicios deben mapear siempre a data en las respuestas.

Buenas prácticas

Evitar lógica compleja en componentes.

Mantener SCSS por componente (no estilos globales innecesarios).

Documentar servicios y funciones con JSDoc en español.

No repetir imports globales; usar SharedModule cuando haya componentes comunes.

🧱 Convención de commits
feat: nueva funcionalidad

fix: corrección

refactor: reestructuración

style: cambios de diseño

docs: documentación

test: pruebas

Ejemplo:

scss
Copiar código
feat(auth): crear login con Angular Signals y PrimeNG
🧭 Objetivo final
Construir un frontend Angular 17:

Modular

Lazy loaded

Con sintaxis moderna

UI profesional (PrimeNG)

Totalmente conectado a la API local de RestorApp

Cada módulo debe poder desarrollarse, probarse y mantenerse de forma independiente.

yaml
Copiar código

---

## 💡 Qué logras con esto
✅ Evita que la IA mezcle estilos viejos (NgModule, `*ngIf`, etc.)  
✅ Garantiza **lazy loading y standalone** en todo el proyecto.  
✅ Mantiene la arquitectura escalable y ordenada desde el inicio.  
✅ Te permite desarrollar o pedir ayuda a Windsurf sin que se “enloquezca”.