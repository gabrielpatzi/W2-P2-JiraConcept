// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  sessionToken: string;
}

// Payload que viene dentro del JWT
export interface JwtPayload {
  userId: number;
  name: string;
  iat: number;
  exp: number;
}