export type ErrorLevel = "excellent" | "good" | "poor";

export type GamePhase = "loading" | "playing" | "completed";

export interface Product {
  readonly id: string;
  readonly nombre: string;
  readonly imagen_url: string;
  readonly categoria: string;
  readonly marca: string | null;
  readonly cantidad: string | null;
  readonly fecha: string;
}

export interface GameResult {
  readonly realPrice: number;
  readonly guess: number;
  readonly errorAbs: number;
  readonly errorPct: number;
  readonly percentile: number;
  readonly errorLevel: ErrorLevel;
}

export interface StoredGameState {
  readonly date: string;
  readonly guess: number;
  readonly result: GameResult;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly product: Product | null;
  readonly result: GameResult | null;
}
