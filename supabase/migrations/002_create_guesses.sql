CREATE TABLE guesses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id   UUID NOT NULL REFERENCES products(id),
  fecha        DATE NOT NULL,
  guess        NUMERIC(6,2) NOT NULL CHECK (guess >= 0 AND guess <= 100),
  error_abs    NUMERIC(6,2) NOT NULL,
  error_pct    NUMERIC(5,2) NOT NULL,
  session_id   TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guesses_product_fecha ON guesses(product_id, fecha);
CREATE INDEX idx_guesses_fecha_error ON guesses(fecha, error_pct);
CREATE INDEX idx_guesses_session_fecha ON guesses(session_id, fecha);

ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;
