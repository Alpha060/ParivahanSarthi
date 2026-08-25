import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'SARATHI_NATIONAL_PORTAL_SECURE_KEY_2026_NIC';

export interface AuthTokenPayload {
  id: string;
  name: string;
  mobile: string;
  role: string;
  state?: string;
  rtoCode?: string;
  designation?: string;
  exp: number;
}

/**
 * Generates a cryptographically signed HMAC-SHA256 JWT-compatible token
 */
export function signToken(payload: Omit<AuthTokenPayload, 'exp'>, expiresInSeconds: number = 86400): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: AuthTokenPayload = { ...payload, exp };
  const payloadEncoded = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payloadEncoded}`)
    .digest('base64url');

  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * Verifies and decodes a signed token
 */
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payloadEncoded, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payloadEncoded}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AuthTokenPayload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Express Middleware: Enforces authentication
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid Bearer token.'
    });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.'
    });
    return;
  }

  (req as any).user = decoded;
  next();
};

/**
 * Express Middleware: Optional authentication (attaches user if valid token present)
 */
export const optionalAuthenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      (req as any).user = decoded;
    }
  }
  next();
};

/**
 * Express Middleware: Enforces Role-Based Access Control (RBAC)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as AuthTokenPayload;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
      return;
    }

    // Super Admin has universal access
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    const officialRoles = ['OFFICIAL', 'MLO_OFFICER', 'ADTT_INSPECTOR', 'DISPATCH_NODAL', 'RTO_DIRECTOR'];
    const isOfficialAllowed = allowedRoles.includes('OFFICIAL') && officialRoles.includes(user.role);

    if (!allowedRoles.includes(user.role) && !isOfficialAllowed) {
      res.status(403).json({
        success: false,
        error: `Access Denied: Role '${user.role}' is not authorized to execute this operation.`
      });
      return;
    }

    next();
  };
};
