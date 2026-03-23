// @liv-standard v1.3
// [F-identity/contract/auth-routes.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM  isEmailAllowed  ../config/allowlist
// wires-out:
//   W-ATOM  authRouter  →  core/api (tRPC root)
// deps:
//   R0  ../config/allowlist   (intra-slice R0 — A2 compliant)
//   R2  ../app/auth-workflow
//   R3  ./trpc-procedures
//   R5  zod, @trpc/server
// validated: pending
//
// Routes:
//   POST /trpc/auth.requestMagicLink  — public
//   POST /trpc/auth.verifyMagicLink   — public
//   POST /trpc/auth.signOut           — protected
//   GET  /trpc/auth.me                — protected
//
// step5b-phaseA (A1, A3):
//   me endpoint: added isAdmin to return shape.
//   Derived server-side from ALLOWED_EMAILS via isEmailAllowed().
//   Client hydrates AuthState.isAdmin from this value — no client-side derivation.
//   Axiom cite: A1 — F-identity owns admin status derivation. A3 — typed boundary.

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
import { isEmailAllowed } from '../config/allowlist';

// ─── Input Schemas ────────────────────────────────────────────────────────────

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
   * POST auth.requestMagicLink — public
   */
  requestMagicLink: publicProcedure
    .input(RequestMagicLinkInput)
    .mutation(async ({ input, ctx }) => {
      const deps = { ...ctx.authDeps as AuthWorkflowDeps, ipAddress: ctx.ipAddress ?? 'unknown' };
      const result = await requestMagicLink(input, deps);
      if (!result.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: result.error.message });
      }
      return result.data;
    }),

  /**
   * POST auth.verifyMagicLink — public
   */
  verifyMagicLink: publicProcedure
    .input(VerifyMagicLinkInput)
    .mutation(async ({ input, ctx }) => {
      const deps = { ...ctx.authDeps as AuthWorkflowDeps, ipAddress: ctx.ipAddress ?? 'unknown' };
      const result = await verifyMagicLink(input, deps);
      if (!result.success) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: result.error.message });
      }
      ctx.setSessionCookie(result.data.rawToken);
      return {
        user: {
          id:    result.data.user.id,
          email: result.data.user.email,
        },
        session: {
          expiresAt: result.data.session.expiresAt,
        },
      };
    }),

  /**
   * POST auth.signOut — protected
   */
  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      const deps = ctx.authDeps as AuthWorkflowDeps;
      const result = await signOut(ctx.session.sessionId, ctx.session.userId, deps);
      ctx.clearSessionCookie();
      if (!result.success) return { message: 'Signed out.' };
      return result.data;
    }),

  /**
   * GET auth.me — protected
   * step5b-phaseA: returns isAdmin derived from ALLOWED_EMAILS server env var.
   */
  me: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        user: {
          id:          ctx.user.id,
          email:       ctx.user.email,
          createdAt:   ctx.user.createdAt,
          lastLoginAt: ctx.user.lastLoginAt,
        },
        session: {
          sessionId: ctx.session.sessionId,
          userId:    ctx.session.userId,
          email:     ctx.session.email,
          expiresAt: ctx.session.expiresAt,
        },
        isAdmin: isEmailAllowed(ctx.user.email),
      };
    }),

});

// ─── Error mapping ────────────────────────────────────────────────────────────

function mapAuthErrorToTRPC(code: string): TRPCError['code'] {
  const mapping: Record<string, TRPCError['code']> = {
    'INVALID_EMAIL':      'BAD_REQUEST',
    'TOKEN_EXPIRED':      'UNAUTHORIZED',
    'TOKEN_INVALID':      'UNAUTHORIZED',
    'TOKEN_ALREADY_USED': 'UNAUTHORIZED',
    'SESSION_EXPIRED':    'UNAUTHORIZED',
    'SESSION_NOT_FOUND':  'UNAUTHORIZED',
    'USER_NOT_FOUND':     'NOT_FOUND',
    'RATE_LIMITED':       'TOO_MANY_REQUESTS',
    'DB_ERROR':           'INTERNAL_SERVER_ERROR',
    'EMAIL_SEND_FAILED':  'INTERNAL_SERVER_ERROR',
  };
  return mapping[code] ?? 'INTERNAL_SERVER_ERROR';
}
