// [F-design-system/R1/C2] Primitive components
// R1: depends on R0 only (design-system tokens).
// No business logic. No state. No events. No side effects.
// These are the only components any slice may use for UI.

import React from 'react'
import { color, font, fontSize, fontWeight, radius, space, border, duration, easing } from '../config'

// ─── Box ──────────────────────────────────────────────────────────────────────

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

export function Box({ as: Tag = 'div', style, ...props }: BoxProps) {
  return <Tag style={style} {...props} />
}

// ─── Stack ────────────────────────────────────────────────────────────────────

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  gap?: keyof typeof space
  align?: React.CSSProperties['alignItems']
  justify?: React.CSSProperties['justifyContent']
}

export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  style,
  ...props
}: StackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: space[gap],
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Text ─────────────────────────────────────────────────────────────────────

type TextVariant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label' | 'mono'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  variant?: TextVariant
  weight?: keyof typeof fontWeight
  muted?: boolean
  truncate?: boolean
}

const textVariantStyles: Record<TextVariant, React.CSSProperties> = {
  display: {
    fontFamily: font.header,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    color: color.white,
  },
  heading: {
    fontFamily: font.header,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: '1.2',
    color: color.white,
  },
  subheading: {
    fontFamily: font.body,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: '1.3',
    color: color.neutral100,
  },
  body: {
    fontFamily: font.body,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: '1.6',
    color: color.neutral200,
  },
  caption: {
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: '1.5',
    color: color.neutral400,
  },
  label: {
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: '1.4',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: color.neutral500,
  },
  mono: {
    fontFamily: font.workspace,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: '1.6',
    color: color.workspaceText,
  },
}

export function Text({
  as: Tag = 'span',
  variant = 'body',
  weight,
  muted,
  truncate,
  style,
  ...props
}: TextProps) {
  return (
    <Tag
      style={{
        ...textVariantStyles[variant],
        ...(weight ? { fontWeight: fontWeight[weight] } : {}),
        ...(muted ? { color: color.neutral500 } : {}),
        ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

const buttonBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[2],
  fontFamily: font.body,
  fontWeight: fontWeight.medium,
  border: 'none',
  cursor: 'pointer',
  transition: `background ${duration.fast} ${easing.standard}, opacity ${duration.fast} ${easing.standard}`,
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

const buttonVariants: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: color.brandAccent,
    color: color.white,
    borderRadius: radius.md,
  },
  secondary: {
    background: color.neutral800,
    color: color.neutral100,
    borderRadius: radius.md,
    border: `1px solid ${color.surfaceBorder}`,
  },
  ghost: {
    background: 'transparent',
    color: color.neutral300,
    borderRadius: radius.md,
  },
  danger: {
    background: color.error,
    color: color.white,
    borderRadius: radius.md,
  },
}

const buttonSizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: '28px', padding: `0 ${space[3]}`, fontSize: fontSize.sm },
  md: { height: '36px', padding: `0 ${space[4]}`, fontSize: fontSize.base },
  lg: { height: '44px', padding: `0 ${space[6]}`, fontSize: fontSize.md },
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        ...buttonBase,
        ...buttonVariants[variant],
        ...buttonSizes[size],
        ...(disabled || loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      {...props}
    >
      {icon}
      {loading ? '…' : children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, style, ...props }: InputProps) {
  return (
    <input
      style={{
        display: 'block',
        width: '100%',
        height: '36px',
        padding: `0 ${space[3]}`,
        fontFamily: font.body,
        fontSize: fontSize.base,
        color: color.neutral100,
        background: color.surfaceRaised,
        border: `1px solid ${error ? color.error : color.surfaceBorder}`,
        borderRadius: radius.md,
        outline: 'none',
        transition: `border-color ${duration.fast} ${easing.standard}`,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, style, ...props }: TextareaProps) {
  return (
    <textarea
      style={{
        display: 'block',
        width: '100%',
        padding: `${space[2]} ${space[3]}`,
        fontFamily: font.body,
        fontSize: fontSize.base,
        color: color.neutral100,
        background: color.surfaceRaised,
        border: `1px solid ${error ? color.error : color.surfaceBorder}`,
        borderRadius: radius.md,
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const badgeColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: color.neutral800, text: color.neutral300 },
  success: { bg: '#14532D', text: '#86EFAC' },
  warning: { bg: '#713F12', text: '#FDE68A' },
  error:   { bg: '#7F1D1D', text: '#FCA5A5' },
  info:    { bg: '#1E3A5F', text: '#93C5FD' },
}

export function Badge({ variant = 'default', style, ...props }: BadgeProps) {
  const c = badgeColors[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${space[0.5]} ${space[2]}`,
        fontFamily: font.body,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.semibold,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: radius.full,
        background: c.bg,
        color: c.text,
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

interface DividerProps {
  style?: React.CSSProperties
}

export function Divider({ style }: DividerProps) {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `1px solid ${color.surfaceBorder}`,
        margin: 0,
        ...style,
      }}
    />
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: number
  style?: React.CSSProperties
}

export function Spinner({ size = 16, style }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2px solid ${color.neutral700}`,
        borderTopColor: color.brandAccent,
        borderRadius: radius.full,
        animation: 'liv-spin 0.7s linear infinite',
        ...style,
      }}
    />
  )
}
