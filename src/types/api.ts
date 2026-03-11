export interface ProductResponse {
  readonly id: string;
  readonly nombre: string;
  readonly imagen_url: string;
  readonly categoria: string;
  readonly marca: string | null;
  readonly cantidad: string | null;
  readonly fecha: string;
  readonly created_at: string;
}

export interface GuessRequest {
  readonly date: string;
  readonly guess: number;
  readonly sessionId: string;
}

export interface GuessResponse {
  readonly realPrice: number;
  readonly errorAbs: number;
  readonly errorPct: number;
  readonly percentile: number;
}

export interface ApiError {
  readonly error: string;
}
