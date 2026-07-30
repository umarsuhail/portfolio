export function getLoginJwtSecret() {
  const secret = process.env.LOGIN_JWT_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("LOGIN_JWT_SECRET must be configured in production.");
  }

  return secret || "local-development-secret";
}