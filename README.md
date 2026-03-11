# prec.io

Juego diario de estimación de precios de supermercado, estilo Wordle.
1 producto al día, 1 intento. ¿Cuánto crees que cuesta?

## Cómo funciona

1. Cada día aparece un producto de supermercado con su foto y nombre
2. Usas el slider (o introduces el precio manualmente) para estimar el precio
3. Al confirmar, se revela el precio real con una animación dramática
4. Ves tu precisión, un medidor visual con gradiente, y tu percentil respecto a otros jugadores
5. Comparte tu resultado sin spoilers

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: React 19, Tailwind CSS v4, [Framer Motion](https://www.framer.com/motion/)
- **Base de datos**: [Supabase](https://supabase.com) (PostgreSQL)
- **Validación**: Zod v4
- **Testing**: Vitest + Testing Library
- **Deploy**: Vercel

## Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/PabloBR99/prec.io.git
cd prec.io

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) |

### Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | Linting con ESLint |
| `npm test` | Ejecutar tests |
| `npm run test:watch` | Tests en modo watch |

## Arquitectura

```
src/
├── app/
│   ├── api/
│   │   ├── guess/route.ts        # POST — enviar estimación
│   │   └── product/today/route.ts # GET — producto del día
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── game/                      # Slider, input, tarjeta de producto
│   ├── result/                    # Gauge, reveal, percentil, compartir
│   └── ui/                        # Header, ThemeProvider
├── hooks/                         # useGameState, useCountdown, useHaptic...
├── lib/
│   ├── api/client.ts              # Fetch helpers (cliente)
│   ├── game/                      # Cálculos, fechas, texto para compartir
│   └── supabase/                  # Clientes y tipos de Supabase
└── types/                         # Tipos de API y juego
```

### API

**`GET /api/product/today`** — Devuelve el producto del día (sin precio).

**`POST /api/guess`** — Envía una estimación.
```json
{ "date": "2026-03-11", "guess": 2.50, "sessionId": "..." }
```
Respuesta:
```json
{ "realPrice": 2.89, "errorAbs": 0.39, "errorPct": 13.5, "percentile": 72.3 }
```

### Base de datos (Supabase)

**`products`** — Pool de productos con precio verificado.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | PK |
| `nombre` | text | Nombre comercial |
| `imagen_url` | text | URL de la foto (Open Food Facts CDN) |
| `precio` | numeric | Precio real verificado |
| `categoria` | text | Categoría del producto |
| `marca` | text | Marca (opcional) |
| `cantidad` | text | Peso/volumen (opcional) |
| `fecha_asignada` | date | Día en que se muestra |
| `activo` | boolean | Habilitado para el juego |

**`guesses`** — Estimaciones anónimas de los jugadores.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | PK |
| `product_id` | uuid | FK a products |
| `fecha` | date | Día de la partida |
| `guess` | numeric | Precio estimado |
| `error_abs` | numeric | Error absoluto |
| `error_pct` | numeric | Error porcentual |
| `session_id` | text | Identificador anónimo del jugador |

## Datos de productos

Los productos provienen de [Open Food Facts](https://world.openfoodfacts.org) (licencia ODbL). Los precios se mantienen manualmente en la base de datos propia — Open Food Facts no proporciona precios fiables.

## Licencia

MIT
