# PreciGame — Requerimientos Técnicos

> Juego diario de estimación de precios de supermercado, estilo Wordle.  
> 1 producto al día. 1 intento. ¿Cuánto crees que cuesta?

---

## 1. Concepto y mecánica

- Cada día se presenta un **único producto**, igual para todos los jugadores del mundo.
- El jugador ve el **nombre comercial** (ej. *Pechuga de pollo fileteada 400g*) y una **foto del producto**.
- Dispone de **1 solo intento** para estimar el precio mediante un selector interactivo.
- Al confirmar, el juego revela:
  - El precio real del producto.
  - El **error absoluto** (ej. *Te has pasado 0,40 €*) y el **error relativo** (ej. *un 12% de desviación*).
  - El **percentil** en el que ha quedado respecto al resto de jugadores del día (ej. *Mejor que el 73% de jugadores*).
- El resultado es **compartible** en redes sociales con un resumen visual sin spoilers (solo el % de error y el percentil).

---

## 2. Producto diario

### Fuente de datos
- **Open Food Facts** (openFoodFacts.org) — licencia ODbL, uso libre incluyendo comercial.
- Campos utilizados: `product_name`, `image_front_url`, `categories`, `brands`, `quantity`.
- Los **precios no provienen de Open Food Facts** (sus datos de precio son incompletos y poco fiables). Se mantienen en una base de datos propia curada manualmente.

### Criterios de selección de productos
- Productos **reconocibles y comunes** en supermercados españoles (preferentemente Mercadona, Lidl, Alcampo).
- Excluir productos con precios históricamente volátiles:
  - Aceite de oliva.
  - Productos frescos sin envasar (fruta, verdura a granel).
  - Combustibles y productos de precio regulado variable.
- Categorías ideales: lácteos envasados, conservas, snacks, bebidas, higiene, limpieza, congelados.
- El producto del día se selecciona de un **pool curado** de entre 200 y 500 productos con precio verificado.
- La selección diaria puede ser aleatoria dentro del pool, garantizando **no repetir producto** hasta haber agotado el ciclo completo.

### Mantenimiento del dataset de precios
- Revisión manual cada **2-3 meses**.
- Script auxiliar opcional para comparar precios actuales con los almacenados (scraping puntual, no automatizado en producción).
- Los precios reflejan el **precio estándar sin promoción** del producto de referencia.

---

## 3. Interfaz de usuario (UI/UX)

> La experiencia visual y de interacción es el elemento diferenciador del producto. Debe ser **espectacular**.

### Pantalla principal (juego activo)

- **Foto del producto**: prominente, centrada, de alta calidad. Efecto de reveal progresivo al cargar (blur → foco).
- **Nombre del producto**: tipografía clara y grande. Solo nombre y gramaje, sin precio ni pistas de categoría de precio.
- **Selector de precio**: el elemento central de la UX. Requisitos:
  - Tipo **slider** personalizado, no un input numérico estándar.
  - Rango fijo: **0 € – 100 €**.
  - Opción para introducir el valor **manualmente** (input numérico) como alternativa al slider.
  - El valor seleccionado se muestra en **tiempo real**, grande y centrado, con formato `X,XX €`.
  - Sensación táctil (haptic feedback en móvil si está disponible).
  - Animación fluida al deslizar. El slider debe sentirse **premium**, no genérico.
- **Botón de confirmar**: solo disponible una vez el usuario ha interactuado con el slider. Estilo llamativo, con micro-animación al hacer hover/press.

### Pantalla de resultado

- Animación de **reveal dramático** al mostrar el precio real.
- Indicador visual de error: puede ser una barra, un medidor, un dial o cualquier elemento que transmita proximidad de forma inmediata e intuitiva.
- Texto del resultado claro:
  - `"Precio real: X,XX €"`
  - `"Tu estimación: X,XX €"`
  - `"Error: X,XX € (X%)"` con color según proximidad (verde si < 10%, amarillo si < 25%, rojo si > 25%).
  - `"Mejor que el X% de jugadores de hoy"` — número grande y destacado.
- Botón de **compartir resultado** con texto preformateado para Twitter/X y WhatsApp.
- Contador de **tiempo hasta el siguiente producto** (countdown al día siguiente).

### Identidad visual

- Estética: moderna, limpia, con personalidad propia. Nada genérico.
- Totalmente **responsive**: mobile-first. La mayoría del tráfico vendrá de móvil.
- Soporte a **dark mode** nativo (según preferencia del sistema).
- Fuentes y colores deben ser coherentes y únicos (no usar paletas por defecto de frameworks).

---

## 4. Arquitectura técnica

### Frontend
- **Framework**: React (con Vite) o Next.js.
- Estado global mínimo: producto del día, estado del intento (pendiente / enviado), resultado.
- Sin dependencias de login para jugar — la partida se guarda en `localStorage` por fecha.
- El resultado del día **no se puede volver a jugar** una vez enviado (bloqueado en localStorage).

### Backend / API
- Endpoint `GET /api/product/today` → devuelve nombre, foto y categoría (sin revelar el precio real).
- Endpoint `POST /api/guess` → recibe `{ date, guess }` → devuelve `{ realPrice, error, errorPct, percentile }`.
- El precio real **nunca viaja al frontend** antes de que el usuario confirme su respuesta.
- Almacenamiento de respuestas anónimas para calcular el percentil en tiempo real.

### Base de datos
- Tabla `products`: id, nombre, imagen_url, precio, categoría, fecha_asignada.
- Tabla `guesses`: id, product_id, fecha, guess, error_pct, timestamp.
- Sin datos personales. Sin autenticación requerida.

### Infraestructura sugerida
- **Frontend**: Vercel o Netlify (free tier suficiente para empezar).
- **Backend**: Supabase (PostgreSQL + API REST gratuita).
- **Imágenes**: servidas directamente desde Open Food Facts CDN para evitar costes de almacenamiento.
