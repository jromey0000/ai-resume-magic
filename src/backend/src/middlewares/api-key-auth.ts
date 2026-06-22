/**
 * API Key Authentication Middleware
 *
 * Validates requests against a configured API key for protected routes.
 * Allows requests to pass if:
 * 1. The route is not protected (not in protected paths list)
 * 2. A valid Bearer token is provided in the Authorization header
 */

import type { Core } from '@strapi/strapi';

const PROTECTED_PATHS = ['/api/user-resumes'];

function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
}

export default (config: Record<string, unknown>, { strapi }: { strapi: Core.Strapi }) => {
  const apiKey = strapi.config.get('server.apiKey') as string | undefined;

  return async (ctx: any, next: () => Promise<void>) => {
    const path = ctx.request.path;

    if (!isProtectedPath(path)) {
      return next();
    }

    if (!apiKey) {
      strapi.log.warn('API_KEY not configured - API routes are unprotected');
      return next();
    }

    const authHeader = ctx.request.headers.authorization;

    if (!authHeader) {
      ctx.status = 401;
      ctx.body = {
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Missing authorization header',
        },
      };
      return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      ctx.status = 401;
      ctx.body = {
        error: {
          status: 401,
          name: 'UnauthorizedError',
          message: 'Invalid authorization format. Use: Bearer <token>',
        },
      };
      return;
    }

    if (token !== apiKey) {
      ctx.status = 403;
      ctx.body = {
        error: {
          status: 403,
          name: 'ForbiddenError',
          message: 'Invalid API key',
        },
      };
      return;
    }

    return next();
  };
};
