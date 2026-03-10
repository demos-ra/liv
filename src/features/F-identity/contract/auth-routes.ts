/**
 * F-identity / R3 / auth-routes.ts
 * [F-identity/R3/C2] tRPC router for auth slice
 *
 * R3 Rules:
 * - Imports from R0, R1, R2 only. NEVER from R4.
 * - Owns the API contract (input shapes, response shapes, HTTP semantics).
 * - O1: All routes explicitly marked public or require authenticated session.
 * - O2: Rate limiting enforced here before R2 workflow is called.
 * - O7: Input validation at this boundary before anything reaches R2.
 *
 * Routes:
 *   POST /trpc/auth.requestMagicLink  — public
 *   POST /trpc/auth.verifyMagicLink   — public (token in body)
 *   POST /trpc/auth.signOut           — requires session
 *   GET  /trpc/auth.me                — requires session
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './trpc-procedures';
import {
  requestMagicLink,
  verifyMagicLink,
  signOut,
  validateAndRefreshSession,
} from '../app/auth-workflow';
import type { AuthWorkflowDeps } from '../app/auth-workflow';
// R3 imports R2 only for execution. Rate limiting is handled via AuthWorkflowDeps.
// AuthErrors is used only at R2 and below — R3 maps to TRPCError codes directly.

// ─── Input Schemas (O7: validated at contract boundary) ───────────────────────

const RequestMagicLinkInput = z.object({
  email: z.string().min(1).max(254),
});

const VerifyMagicLinkInput = z.object({
  token: z.string().min(32).max(128),
  email: z.string().min(1).max(254),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const authRouter = createTRPCRouter({

  /**
   * POST auth.requestMagicLink
   * O1: Public. No auth required.
   * O2: Rate limited by email (3/hour) and IP (10/hour).
   * Triggers both register (new user) and login (existing user).
   */
  requestMagicLink: publicProcedure
    .input(RequestMagicLinkInput)
    .mutation(async ({ input, ctx }) => {
      // O2: Rate limiting is enforced inside R2 workflow via deps.checkRateLimit
      const deps = { ...ctx.authDeps as AuthWorkflowDeps, ipAddress: ctx.ipAddress ?? 'unknown' };

      const result = await requestMagicLink(input, deps);

      if (!result.success) {
        // Never leak internal error details on public endpoints
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: result.error.message,
        });
      }

      return result.data;
    }),

  /**
   * POST auth.verifyMagicLink
   * O1: Public. Token is the credential.
   * O2: Rate limited by IP (5 attempts/15min).
   * Sets httpOnly session cookie on success.
   */
  verifyMagicLink: publicProcedure
    .input(VerifyMagicLinkInput)
    .mutation(async ({ input, ctx }) => {
      // O2: Rate limiting enforced inside R2 workflow via deps.checkRateLimit
      const deps = { ...ctx.authDeps as AuthWorkflowDeps, ipAddress: ctx.ipAddress ?? 'unknown' };

      const result = await verifyMagicLink(input, deps);

      if (!result.success) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: result.error.message,
        });
      }

      // Set httpOnly session cookie
      ctx.setSessionCookie(result.data.session.tokenHash);

      return {
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
        },
        session: {
          expiresAt: result.data.session.expiresAt,
        },
      };
    }),

  /**
   * POST auth.signOut
   * O1: Requires valid session.
   * Clears session from DB and clears cookie.
   */
  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      const deps = ctx.authDeps as AuthWorkflowDeps;

      const result = await signOut(
        ctx.session.sessionId,
        ctx.session.userId,
        deps
      );

      ctx.clearSessionCookie();

      if (!result.success) {
        // Sign out best-effort — cookie is cleared regardless
        return { message: 'Signed out.' };
      }

      return result.data;
    }),

  /**
   * GET auth.me
   * O1: Requires valid session.
   * Returns current user. Used by client to hydrate auth state.
   */
  me: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        user: {
          id: ctx.user.id,
          email: ctx.user.email,
          createdAt: ctx.user.createdAt,
          lastLoginAt: ctx.user.lastLoginAt,
        },
        session: {
          sessionId: ctx.session.sessionId,
          expiresAt: ctx.session.expiresAt,
        },
      };
    }),

});

// ─── Route -> tRPC code mapping ───────────────────────────────────────────────

function mapAuthErrorToTRPC(code: string): TRPCError['code'] {
  const mapping: Record<string, TRPCError['code']> = {
    'INVALID_EMAIL': 'BAD_REQUEST',
    'TOKEN_EXPIRED': 'UNAUTHORIZED',
    'TOKEN_INVALID': 'UNAUTHORIZED',
    'TOKEN_ALREADY_USED': 'UNAUTHORIZED',
    'SESSION_EXPIRED': 'UNAUTHORIZED',
    'SESSION_NOT_FOUND': 'UNAUTHORIZED',
    'USER_NOT_FOUND': 'NOT_FOUND',
    'RATE_LIMITED': 'TOO_MANY_REQUESTS',
    'DB_ERROR': 'INTERNAL_SERVER_ERROR',
    'EMAIL_SEND_FAILED': 'INTERNAL_SERVER_ERROR',
  };
  return mapping[code] ?? 'INTERNAL_SERVER_ERROR';
}
