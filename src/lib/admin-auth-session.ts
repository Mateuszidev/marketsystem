import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

export type AdminSession = {
  username: string;
  expiresAt: string;
};

type AdminSessionTokenPayload = {
  username: string;
  exp: number;
};

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET nao configurado.");
  }

  return secret;
};

const signValue = (value: string) => createHmac("sha256", getSessionSecret()).update(value).digest("base64url");

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const createAdminSessionToken = (username: string) => {
  const payload: AdminSessionTokenPayload = {
    username,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
};

export const verifyAdminSessionToken = (token?: string | null): AdminSession | null => {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionTokenPayload;

    if (!payload.username || payload.exp <= Date.now()) {
      return null;
    }

    return {
      username: payload.username,
      expiresAt: new Date(payload.exp).toISOString(),
    };
  } catch {
    return null;
  }
};
