CREATE TABLE products (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre         TEXT NOT NULL,
  imagen_url     TEXT NOT NULL,
  precio         NUMERIC(6,2) NOT NULL CHECK (precio > 0 AND precio <= 100),
  categoria      TEXT NOT NULL,
  marca          TEXT,
  cantidad       TEXT,
  off_barcode    TEXT,
  fecha_asignada DATE UNIQUE,
  activo         BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_fecha ON products(fecha_asignada);
CREATE INDEX idx_products_activo ON products(activo);

-- RLS: No anon read access. All access through service_role in API routes.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
