export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "customer" | "dealer" | "admin";
    };
  }
}
