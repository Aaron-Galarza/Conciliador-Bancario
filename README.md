# API - Conciliador Bancario

Sistema de conciliación bancaria automática que cruza **ventas**, **liquidaciones de procesadores de pago** y **movimientos bancarios** para detectar coincidencias, diferencias y casos pendientes de revisión.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | NestJS v11 |
| Lenguaje | TypeScript 5.7 |
| Base de datos | PostgreSQL |
| ORM | Prisma v7 |
| Documentación | Swagger / OpenAPI (`/api`) |
| Runtime | Node.js |

---

## Requisitos previos

- **Node.js** v18 o superior
- **PostgreSQL** corriendo localmente en el puerto `5432`
- Base de datos creada con el nombre `conciliador`
- Usuario `postgres` con contraseña `admin` (o ajustar el `.env`)

---

## Instalación y puesta en marcha desde cero

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar la base de datos

El archivo `backend/.env` ya tiene la cadena de conexión por defecto:

```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/conciliador?schema=public"
```

Si tu PostgreSQL usa otro usuario o contraseña, editá ese archivo antes de continuar.

### 3. Ejecutar migraciones de Prisma

Esto crea todas las tablas en la base de datos:

```bash
npx prisma migrate deploy
```

> Si es la primera vez y no existe ninguna migración aplicada, usá `npx prisma migrate dev` en su lugar.

### 4. Cargar datos de prueba (seed)

Carga 10 ventas, 9 liquidaciones, 9 movimientos bancarios y 6 reglas de conciliación cubriendo todos los escenarios posibles:

```bash
npm run seed
```

### 5. Levantar el servidor

```bash
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.
La documentación Swagger interactiva en `http://localhost:3000/api`.

---

### Flujo recomendado de prueba - endpoints basicos

Seguí este orden para probar y verificar que el ciclo completo de conciliación es correcto localmente:

#### Paso 1 — Verificar que el servidor responde

```
GET http://localhost:3000/
```
Respuesta esperada: `"Hello World!"`

#### Paso 2 — Ver los datos del seed cargados

```
GET http://localhost:3000/sales
GET http://localhost:3000/settlements
GET http://localhost:3000/bank-movements
```

Deberías ver los arrays con los 10 registros de ventas, 9 liquidaciones y 9 movimientos bancarios.

#### Paso 3 — Ejecutar la conciliación automática

```
POST http://localhost:3000/reconciliation/run
```
Sin body. El motor cruza automáticamente ventas con liquidaciones y movimientos bancarios.

Respuesta esperada:
```json
{
  "processed": 10,
  "reconciled": 6,
  "pending": 1,
  "differences": 3
}
```

#### Paso 4 — Ver el dashboard de resultados

```
GET http://localhost:3000/reconciliation/dashboard
```

#### Paso 5 — Explorar los distintos escenarios

Filtrá conciliaciones por estado para ver cada caso:

```
GET http://localhost:3000/reconciliation?status=AUTO_RECONCILED
GET http://localhost:3000/reconciliation?status=DIFFERENCE_DETECTED
GET http://localhost:3000/reconciliation?status=PENDING
```

#### Paso 6 — Resolver una diferencia manualmente

Copiá el `id` de alguna conciliación con `DIFFERENCE_DETECTED` y enviá:

```
PATCH http://localhost:3000/reconciliation/{id}/manual
Content-Type: application/json

{
  "notes": "Diferencia justificada por retención especial del período",
  "resolvedBy": "admin"
}
```

#### Paso 7 — Ver liquidaciones y movimientos huérfanos

```
GET http://localhost:3000/settlements/unmatched
GET http://localhost:3000/bank-movements/unmatched
```

El seed incluye un registro de cada tipo sin conciliación asociada, para simular casos reales.

---

## Escenarios de prueba incluidos en el seed

| # | Factura | Medio de pago | Escenario |
|---|---------|---------------|-----------|
| 1 | FAC-45821 | Crédito VISA | Conciliación perfecta: todo coincide |
| 2 | FAC-45822 | Débito BANELCO | Comisiones dentro del rango esperado |
| 3 | FAC-45823 | Crédito MASTERCARD | Banco depositó menos de lo calculado |
| 4 | FAC-45824 | Crédito VISA | Venta pendiente: sin liquidación todavía |
| 5 | FAC-45825 | Transferencia | Transferencia exacta sin comisiones |
| 6 | FAC-45826 | Crédito VISA | Contracargo parcial post-venta |
| 7 | FAC-45827 | Marketplace (MP) | Comisión alta de MercadoPago |
| 8 | FAC-45828 | QR (MODO) | Pago QR con acreditación el mismo día |
| 9a | FAC-45829 | Marketplace (MP) | Depósito agrupado — parte 1 de 2 |
| 9b | FAC-45830 | Marketplace (MP) | Depósito agrupado — parte 2 de 2 |

---

## Índice de Endpoints

| Módulo | Método | Path | Operación |
|--------|--------|------|-----------|
| Root | GET | `/` | Health check |
| Ventas | POST | `/sales` | Crear venta |
| Ventas | GET | `/sales` | Listar ventas |
| Ventas | GET | `/sales/:id` | Ver venta por ID |
| Liquidaciones | POST | `/settlements` | Crear liquidación |
| Liquidaciones | GET | `/settlements` | Listar liquidaciones |
| Liquidaciones | GET | `/settlements/unmatched` | Liquidaciones sin venta |
| Liquidaciones | GET | `/settlements/:id` | Ver liquidación por ID |
| Movimientos Bancarios | POST | `/bank-movements` | Crear movimiento |
| Movimientos Bancarios | GET | `/bank-movements` | Listar movimientos |
| Movimientos Bancarios | GET | `/bank-movements/unmatched` | Movimientos sin liquidación |
| Movimientos Bancarios | GET | `/bank-movements/:id` | Ver movimiento por ID |
| Conciliación | POST | `/reconciliation/run` | Ejecutar conciliación automática |
| Conciliación | POST | `/reconciliation/sale/:saleId` | Conciliar venta específica |
| Conciliación | GET | `/reconciliation` | Listar conciliaciones |
| Conciliación | GET | `/reconciliation/dashboard` | Resumen dashboard |
| Conciliación | GET | `/reconciliation/:id` | Ver conciliación por ID |
| Conciliación | PATCH | `/reconciliation/:id/manual` | Conciliación manual |
| Reglas | POST | `/rules` | Crear regla |
| Reglas | GET | `/rules` | Listar reglas activas |
| Reglas | PATCH | `/rules/:id` | Actualizar regla |
| Reglas | PATCH | `/rules/:id/deactivate` | Desactivar regla |
| Importación | POST | `/imports/json` | Importar datos desde JSON |

---

## Enums de Referencia

### PaymentMethod
```
CASH | CREDIT_CARD | DEBIT_CARD | TRANSFER | QR | MARKETPLACE | ACCOUNT_RECEIVABLE
```

### DataSource
```
ARGESTION | POSBERRY | MANUAL | IMPORT
```

### SaleStatus
```
PENDING | SETTLED | RECONCILED
```

### ReconciliationStatus
```
PENDING | AUTO_RECONCILED | MANUALLY_RECONCILED | DIFFERENCE_DETECTED
```

---

## 1. Root

### GET `/`
Health check del servidor.

**Response:**
```
"Hello World!" (string)
```

---

## 2. Ventas — `/sales`

### POST `/sales`
Registra una nueva venta.

**Body:**
```json
{
  "invoiceNumber": "FAC-45821",        // string, requerido
  "date": "2024-04-12T10:00:00Z",      // ISO 8601, requerido
  "amount": 120000,                    // number positivo, requerido
  "paymentMethod": "CREDIT_CARD",      // enum PaymentMethod, requerido
  "source": "ARGESTION",               // enum DataSource, requerido
  "currency": "ARS",                   // string, opcional
  "externalId": "EXT-12345",           // string, opcional
  "notes": "Notas adicionales"         // string, opcional
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "invoiceNumber": "FAC-45821",
  "date": "2024-04-12T10:00:00Z",
  "amount": "120000.00",
  "currency": "ARS",
  "paymentMethod": "CREDIT_CARD",
  "source": "ARGESTION",
  "status": "PENDING",
  "externalId": "EXT-12345",
  "notes": "Notas adicionales",
  "createdAt": "2024-04-12T10:00:00Z",
  "updatedAt": "2024-04-12T10:00:00Z",
  "reconciliation": null
}
```

**Errores:**
- `400` — Campos inválidos o faltantes
- `500` — Error de base de datos

---

### GET `/sales`
Lista todas las ventas. Permite filtrar por estado.

**Query params:**
| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `status` | SaleStatus | No | Filtrar por estado: `PENDING`, `SETTLED`, `RECONCILED` |

**Ejemplo:** `GET /sales?status=PENDING`

**Response `200`:** Array de ventas con su objeto `reconciliation` incluido (ver estructura en GET `/sales/:id`).

---

### GET `/sales/:id`
Obtiene una venta específica con toda su trazabilidad.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la venta |

**Response `200`:**
```json
{
  "id": "uuid",
  "invoiceNumber": "FAC-45821",
  "date": "2024-04-12T10:00:00Z",
  "amount": "120000.00",
  "currency": "ARS",
  "paymentMethod": "CREDIT_CARD",
  "source": "ARGESTION",
  "status": "RECONCILED",
  "externalId": null,
  "notes": null,
  "createdAt": "2024-04-12T10:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "reconciliation": {
    "id": "uuid",
    "status": "AUTO_RECONCILED",
    "saleId": "uuid",
    "settlementId": "uuid",
    "bankMovementId": "uuid",
    "expectedNet": "114600.00",
    "actualNet": "114600.00",
    "differenceAmount": "0.00",
    "differencePercent": "0.0000",
    "notes": null,
    "resolvedAt": "2024-04-19T00:00:00Z",
    "resolvedBy": "AUTO",
    "createdAt": "2024-04-19T00:00:00Z",
    "updatedAt": "2024-04-19T00:00:00Z",
    "settlement": { "...objeto liquidación..." },
    "bankMovement": { "...objeto movimiento bancario..." }
  }
}
```

**Errores:**
- `404` — Venta no encontrada

---

## 3. Liquidaciones — `/settlements`

### POST `/settlements`
Registra una nueva liquidación de procesador de pagos.

**Body:**
```json
{
  "date": "2024-04-19T00:00:00Z",          // ISO 8601, requerido
  "processor": "VISA",                      // string, requerido
  "grossAmount": 120000,                    // number positivo, requerido
  "netAmount": 114600,                      // number positivo, requerido
  "reference": "LIQ-2024-0419-001",         // string, opcional
  "commission": 3600,                       // number >= 0, opcional (default: 0)
  "taxRetention": 1800,                     // number >= 0, opcional (default: 0)
  "financingCost": 0,                       // number >= 0, opcional (default: 0)
  "otherDeductions": 0,                     // number >= 0, opcional (default: 0)
  "currency": "ARS",                        // string, opcional
  "notes": "Notas adicionales"              // string, opcional
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "date": "2024-04-19T00:00:00Z",
  "processor": "VISA",
  "reference": "LIQ-2024-0419-001",
  "grossAmount": "120000.00",
  "commission": "3600.00",
  "taxRetention": "1800.00",
  "financingCost": "0.00",
  "otherDeductions": "0.00",
  "netAmount": "114600.00",
  "currency": "ARS",
  "notes": null,
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "reconciliation": null
}
```

**Errores:**
- `400` — Campos inválidos o faltantes
- `500` — Error de base de datos

---

### GET `/settlements`
Lista todas las liquidaciones con sus datos de conciliación.

**Response `200`:** Array de liquidaciones con objeto `reconciliation` incluido (ver estructura en GET `/settlements/:id`).

---

### GET `/settlements/unmatched`
Lista liquidaciones que no tienen ninguna venta ni conciliación asociada.

**Response `200`:** Array de liquidaciones sin `reconciliation`.

---

### GET `/settlements/:id`
Obtiene una liquidación específica con toda su trazabilidad.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la liquidación |

**Response `200`:**
```json
{
  "id": "uuid",
  "date": "2024-04-19T00:00:00Z",
  "processor": "VISA",
  "reference": "LIQ-2024-0419-001",
  "grossAmount": "120000.00",
  "commission": "3600.00",
  "taxRetention": "1800.00",
  "financingCost": "0.00",
  "otherDeductions": "0.00",
  "netAmount": "114600.00",
  "currency": "ARS",
  "notes": null,
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "reconciliation": {
    "id": "uuid",
    "status": "AUTO_RECONCILED",
    "saleId": "uuid",
    "settlementId": "uuid",
    "bankMovementId": "uuid",
    "expectedNet": "114600.00",
    "actualNet": "114600.00",
    "differenceAmount": "0.00",
    "differencePercent": "0.0000",
    "notes": null,
    "resolvedAt": "2024-04-19T00:00:00Z",
    "resolvedBy": "AUTO",
    "createdAt": "2024-04-19T00:00:00Z",
    "updatedAt": "2024-04-19T00:00:00Z",
    "sale": { "...objeto venta..." },
    "bankMovement": { "...objeto movimiento bancario..." }
  }
}
```

**Errores:**
- `404` — Liquidación no encontrada

---

## 4. Movimientos Bancarios — `/bank-movements`

### POST `/bank-movements`
Registra un nuevo movimiento bancario.

**Body:**
```json
{
  "date": "2024-04-19T00:00:00Z",                    // ISO 8601, requerido
  "amount": 114600,                                   // number positivo, requerido
  "description": "liquidación adquirente tarjetas",   // string, requerido
  "bankAccount": "CA 0000-123456789",                 // string, requerido
  "reference": "VISA-0419-001",                       // string, opcional
  "currency": "ARS",                                  // string, opcional
  "notes": "Notas adicionales"                        // string, opcional
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "date": "2024-04-19T00:00:00Z",
  "amount": "114600.00",
  "description": "liquidación adquirente tarjetas",
  "reference": "VISA-0419-001",
  "bankAccount": "CA 0000-123456789",
  "currency": "ARS",
  "notes": null,
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "reconciliation": null
}
```

**Errores:**
- `400` — Campos inválidos o faltantes
- `500` — Error de base de datos

---

### GET `/bank-movements`
Lista todos los movimientos bancarios con sus datos de conciliación.

**Response `200`:** Array de movimientos con objeto `reconciliation` incluido.

---

### GET `/bank-movements/unmatched`
Lista movimientos bancarios que no tienen ninguna liquidación ni conciliación asociada.

**Response `200`:** Array de movimientos sin `reconciliation`.

---

### GET `/bank-movements/:id`
Obtiene un movimiento bancario específico con toda su trazabilidad.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID del movimiento bancario |

**Response `200`:**
```json
{
  "id": "uuid",
  "date": "2024-04-19T00:00:00Z",
  "amount": "114600.00",
  "description": "liquidación adquirente tarjetas",
  "reference": "VISA-0419-001",
  "bankAccount": "CA 0000-123456789",
  "currency": "ARS",
  "notes": null,
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "reconciliation": {
    "id": "uuid",
    "status": "AUTO_RECONCILED",
    "saleId": "uuid",
    "settlementId": "uuid",
    "bankMovementId": "uuid",
    "expectedNet": "114600.00",
    "actualNet": "114600.00",
    "differenceAmount": "0.00",
    "differencePercent": "0.0000",
    "notes": null,
    "resolvedAt": "2024-04-19T00:00:00Z",
    "resolvedBy": "AUTO",
    "createdAt": "2024-04-19T00:00:00Z",
    "updatedAt": "2024-04-19T00:00:00Z",
    "sale": { "...objeto venta..." },
    "settlement": { "...objeto liquidación..." }
  }
}
```

**Errores:**
- `404` — Movimiento bancario no encontrado

---

## 5. Conciliación — `/reconciliation`

### POST `/reconciliation/run`
Ejecuta la conciliación automática sobre **todas las ventas pendientes**.

**Body:** Ninguno

**Response `200`:**
```json
{
  "processed": 5,      // total de ventas procesadas
  "reconciled": 3,     // conciliadas automáticamente
  "pending": 1,        // siguen pendientes (falta liquidación o movimiento)
  "differences": 1     // diferencias detectadas fuera de tolerancia
}
```

**Errores:**
- `500` — Error en el motor de conciliación

---

### POST `/reconciliation/sale/:saleId`
Ejecuta la conciliación sobre una **venta específica**.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `saleId` | UUID | ID de la venta a conciliar |

**Body:** Ninguno

**Response `200`:** Objeto de conciliación completo (ver GET `/reconciliation/:id`).

**Errores:**
- `404` — Venta no encontrada

---

### GET `/reconciliation`
Lista todas las conciliaciones. Permite filtrar por estado.

**Query params:**
| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `status` | ReconciliationStatus | No | `PENDING`, `AUTO_RECONCILED`, `MANUALLY_RECONCILED`, `DIFFERENCE_DETECTED` |

**Ejemplo:** `GET /reconciliation?status=DIFFERENCE_DETECTED`

**Response `200`:** Array de conciliaciones con `sale`, `settlement` y `bankMovement` incluidos.

---

### GET `/reconciliation/dashboard`
Retorna un resumen del estado general de la conciliación, útil para dashboards.

**Body:** Ninguno

**Response `200`:**
```json
{
  "total": 100,
  "auto": 75,
  "manual": 15,
  "difference": 5,
  "pending": 5,
  "totalDifferenceAmount": "27500.00"
}
```

| Campo | Descripción |
|-------|-------------|
| `total` | Total de conciliaciones en el sistema |
| `auto` | Cantidad con status `AUTO_RECONCILED` |
| `manual` | Cantidad con status `MANUALLY_RECONCILED` |
| `difference` | Cantidad con status `DIFFERENCE_DETECTED` |
| `pending` | Cantidad con status `PENDING` |
| `totalDifferenceAmount` | Suma total de diferencias de monto detectadas |

---

### GET `/reconciliation/:id`
Obtiene una conciliación específica con toda su trazabilidad.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la conciliación |

**Response `200`:**
```json
{
  "id": "uuid",
  "status": "AUTO_RECONCILED",
  "saleId": "uuid",
  "settlementId": "uuid",
  "bankMovementId": "uuid",
  "expectedNet": "114600.00",
  "actualNet": "114600.00",
  "differenceAmount": "0.00",
  "differencePercent": "0.0000",
  "notes": null,
  "resolvedAt": "2024-04-19T00:00:00Z",
  "resolvedBy": "AUTO",
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z",
  "sale": { "...objeto venta completo..." },
  "settlement": { "...objeto liquidación completo..." },
  "bankMovement": { "...objeto movimiento bancario completo..." }
}
```

| Campo | Descripción |
|-------|-------------|
| `expectedNet` | Monto que debería haber llegado al banco (venta − deducciones según regla) |
| `actualNet` | Monto que efectivamente llegó al banco |
| `differenceAmount` | `expectedNet − actualNet` |
| `differencePercent` | Diferencia en porcentaje |
| `resolvedBy` | `"AUTO"` si fue automático, o nombre de usuario si fue manual |

**Errores:**
- `404` — Conciliación no encontrada

---

### PATCH `/reconciliation/:id/manual`
Marca una conciliación como resuelta manualmente.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la conciliación |

**Body:**
```json
{
  "notes": "Diferencia justificada por retención especial del período",  // string, requerido
  "resolvedBy": "nombre.usuario"                                          // string, requerido
}
```

**Response `200`:** Objeto de conciliación con `status: "MANUALLY_RECONCILED"`, `resolvedAt` y `resolvedBy` actualizados.

**Errores:**
- `400` — Faltan `notes` o `resolvedBy`
- `500` — Error de base de datos

---

## 6. Reglas de Conciliación — `/rules`

### POST `/rules`
Crea una nueva regla de conciliación para un método de pago / procesador.

**Body:**
```json
{
  "name": "Visa crédito - Estándar",    // string, requerido
  "paymentMethod": "CREDIT_CARD",        // enum PaymentMethod, requerido
  "commissionPercent": 3.0,              // number 0-100, requerido (ej: 3 = 3%)
  "processor": "VISA",                   // string, opcional
  "taxRetentionPercent": 1.5,            // number >= 0, opcional
  "financingCostPercent": 0,             // number >= 0, opcional
  "toleranceDays": 7,                    // number >= 0, opcional (días de tolerancia para matching)
  "toleranceAmountPercent": 0.5,         // number >= 0, opcional (tolerancia de monto en %)
  "notes": "Notas de la regla"           // string, opcional
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "name": "Visa crédito - Estándar",
  "paymentMethod": "CREDIT_CARD",
  "processor": "VISA",
  "commissionPercent": "3.0000",
  "taxRetentionPercent": "1.5000",
  "financingCostPercent": "0.0000",
  "toleranceDays": 7,
  "toleranceAmountPercent": "0.5000",
  "isActive": true,
  "notes": "Notas de la regla",
  "createdAt": "2024-04-19T00:00:00Z",
  "updatedAt": "2024-04-19T00:00:00Z"
}
```

**Errores:**
- `400` — Campos inválidos o `commissionPercent` fuera de rango
- `500` — Error de base de datos (ej: combinación `paymentMethod` + `processor` duplicada)

---

### GET `/rules`
Lista todas las reglas activas (`isActive: true`).

**Response `200`:** Array de reglas de conciliación.

---

### PATCH `/rules/:id`
Actualiza una regla existente. Todos los campos son opcionales.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la regla |

**Body:** (todos opcionales)
```json
{
  "name": "Nuevo nombre",
  "paymentMethod": "CREDIT_CARD",
  "processor": "VISA",
  "commissionPercent": 3.5,
  "taxRetentionPercent": 1.5,
  "financingCostPercent": 0,
  "toleranceDays": 7,
  "toleranceAmountPercent": 0.5,
  "notes": "Notas actualizadas"
}
```

**Response `200`:** Objeto de regla actualizado.

**Errores:**
- `404` — Regla no encontrada
- `400` — Campos inválidos

---

### PATCH `/rules/:id/deactivate`
Desactiva una regla sin eliminarla (soft delete). Setea `isActive: false`.

**Path params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID de la regla |

**Body:** Ninguno

**Response `200`:** Objeto de regla con `isActive: false`.

**Errores:**
- `404` — Regla no encontrada

---

## 7. Importación — `/imports`

### POST `/imports/json`
Importa en bulk ventas, liquidaciones y movimientos bancarios desde un JSON. Útil para cargas iniciales o integraciones.

**Body:**
```json
{
  "sales": [
    {
      "invoiceNumber": "FAC-45821",
      "date": "2024-04-12T10:00:00Z",
      "amount": 120000,
      "paymentMethod": "CREDIT_CARD",
      "source": "ARGESTION",
      "currency": "ARS",
      "externalId": "EXT-12345",
      "notes": "Notas"
    }
  ],
  "settlements": [
    {
      "date": "2024-04-19T00:00:00Z",
      "processor": "VISA",
      "grossAmount": 120000,
      "netAmount": 114600,
      "reference": "LIQ-2024-0419-001",
      "commission": 3600,
      "taxRetention": 1800,
      "financingCost": 0,
      "otherDeductions": 0,
      "currency": "ARS",
      "notes": "Notas"
    }
  ],
  "bankMovements": [
    {
      "date": "2024-04-19T00:00:00Z",
      "amount": 114600,
      "description": "liquidación adquirente tarjetas",
      "bankAccount": "CA 0000-123456789",
      "reference": "VISA-0419-001",
      "currency": "ARS",
      "notes": "Notas"
    }
  ]
}
```

> Todos los arrays son opcionales. Se puede enviar solo `sales`, solo `settlements`, solo `bankMovements`, o cualquier combinación.

**Response `200`:**
```json
{
  "sales": {
    "imported": 10,
    "skipped": 1,
    "errors": ["invoiceNumber FAC-00001 ya existe, se omitió"]
  },
  "settlements": {
    "imported": 5,
    "skipped": 0,
    "errors": []
  },
  "bankMovements": {
    "imported": 5,
    "skipped": 0,
    "errors": []
  }
}
```

> **Nota importante:** Las ventas usan lógica UPSERT — si el `invoiceNumber` ya existe, se omite (no se sobreescribe). Las liquidaciones y movimientos bancarios usan INSERT directo.

**Errores:**
- `400` — Estructura JSON inválida o campos requeridos faltantes
- `500` — Error de base de datos
