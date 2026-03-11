# prec.io

Código fuente de [prec.io](https://prec-io.vercel.app) — juego diario de estimación de precios de supermercado.

## Desarrollo local

```bash
git clone https://github.com/PabloBR99/prec.io.git
cd prec.io
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
npm run dev
```

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) |

## Tech stack

Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Supabase, Vercel.

## Licencia

MIT
