// @liv-standard v1.3
// [F-design-system/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-design-system
// layer:      R3
// wires-in:   none
// wires-out:
//   W-ATOM  Brand           → F-identity/R3, F-chat/R3
//   W-ATOM  InputContainer  → F-identity/R3, F-chat/R3
//   W-ATOM  SendIcon        → F-identity/R3, F-chat/R3
//   W-ATOM  Spinner         → F-identity/R3, F-chat/R3
//   W-ATOM  ButtonText      → F-chat/R3
//   W-ATOM  Input           → F-chat/R3
//   W-ATOM  Label           → F-chat/R3
//   W-ATOM  Overlay         → F-chat/R3
//   W-ATOM  SlidePanel      → F-chat/R3
//   W-ATOM  Button          → (declared, no active consumer)
//   W-ATOM  ButtonIcon      → (declared, no active consumer)
//   W-ATOM  Text            → (declared, no active consumer)
//   W-ATOM  Heading         → (declared, no active consumer)
//   W-ATOM  StatusDot       → (declared, no active consumer)
//   W-ATOM  Badge           → (declared, no active consumer)
//   W-ATOM  Divider         → (declared, no active consumer)
//   W-ATOM  Surface         → (declared, no active consumer)
//   W-ATOM  Toast           → (declared, no active consumer)
//   W-ATOM  ToastContainer  → (declared, no active consumer)
// deps:
//   R5  react
// validated: pending

import { forwardRef } from 'react'

// ── Brand ────────────────────────────────────────────────────────────────────

type BrandVariant = 'header' | 'login'

export function Brand({ variant }: { variant: BrandVariant }) {
  if (variant === 'login') {
    return (
      <div className="login-brand">
        <span className="brand">LIV</span>
      </div>
    )
  }
  return <span className="brand">LIV</span>
}

// ── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'accent' | 'ghost' | 'danger'

interface ButtonProps {
  variant: ButtonVariant
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ variant, disabled, onClick, children, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ── ButtonText ───────────────────────────────────────────────────────────────

type ButtonTextVariant = 'accent' | 'danger'

interface ButtonTextProps {
  variant: ButtonTextVariant
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export function ButtonText({ variant, disabled, onClick, children, type = 'button' }: ButtonTextProps) {
  return (
    <button
      type={type}
      className={`btn-text btn-text-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ── ButtonIcon ───────────────────────────────────────────────────────────────

interface ButtonIconProps {
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  'aria-label': string
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export function ButtonIcon({
  onClick,
  disabled,
  active,
  'aria-label': ariaLabel,
  children,
  type = 'button',
}: ButtonIconProps) {
  return (
    <button
      type={type}
      className={`btn-icon${active ? ' active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

// ── InputContainer ───────────────────────────────────────────────────────────
// Monoform pill — login input and chat input. Bare input + icon slot.

interface InputContainerProps {
  placeholder?: string
  type?: string
  disabled?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  autoComplete?: string
  autoCapitalize?: string
  autoCorrect?: string
  spellCheck?: boolean
  'aria-label'?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  icon?: React.ReactNode
}

export const InputContainer = forwardRef<HTMLDivElement, InputContainerProps>(
  function InputContainer(
    {
      placeholder,
      type = 'text',
      disabled,
      value,
      onChange,
      onKeyDown,
      autoFocus,
      autoComplete,
      autoCapitalize,
      autoCorrect,
      spellCheck,
      'aria-label': ariaLabel,
      inputRef,
      icon,
    },
    ref
  ) {
    return (
      <div className="input-container" ref={ref}>
        <input
          ref={inputRef}
          className="input-bare"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
          aria-label={ariaLabel}
        />
        {icon}
      </div>
    )
  }
)

// ── Input ────────────────────────────────────────────────────────────────────
// Panel settings fields — 32px height, 8px radius, input-panel-bg, inset shadow on focus.

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
}

export function Input({ type = 'text', placeholder, value, disabled, onChange, onKeyDown, style }: InputProps) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      style={style}
    />
  )
}

// ── Label ────────────────────────────────────────────────────────────────────

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="label">{children}</span>
}

// ── Text ─────────────────────────────────────────────────────────────────────

type TextRole = 'body' | 'sec' | 'dis' | 'error'

interface TextProps {
  role: TextRole
  children: React.ReactNode
  className?: string
}

export function Text({ role, children, className }: TextProps) {
  const base = role === 'body' ? 'text-body' : `text-${role}`
  return (
    <span className={className ? `${base} ${className}` : base}>
      {children}
    </span>
  )
}

// ── Heading ──────────────────────────────────────────────────────────────────

interface HeadingProps {
  level: 1 | 2
  children: React.ReactNode
}

export function Heading({ level, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2'
  return <Tag className={`h${level}`}>{children}</Tag>
}

// ── Spinner ──────────────────────────────────────────────────────────────────

type SpinnerSize = 'sm' | 'default'

export function Spinner({ size = 'default' }: { size?: SpinnerSize }) {
  return (
    <div
      className={size === 'sm' ? 'spinner spinner-sm' : 'spinner'}
      role="status"
      aria-label="Loading"
    />
  )
}

// ── StatusDot ────────────────────────────────────────────────────────────────

type DotStatus = 'accent' | 'error' | 'caution' | 'dis'

export function StatusDot({ status }: { status: DotStatus }) {
  return <div className={`dot dot-${status}`} />
}

// ── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'accent' | 'error' | 'caution'

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

// ── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="divider" />
}

// ── Surface ──────────────────────────────────────────────────────────────────

export function Surface({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="surface" style={style}>
      {children}
    </div>
  )
}

// ── Overlay ──────────────────────────────────────────────────────────────────

interface OverlayProps {
  open: boolean
  onClose: () => void
}

export function Overlay({ open, onClose }: OverlayProps) {
  return (
    <div
      className={`overlay${open ? ' open' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
  )
}

// ── SlidePanel ───────────────────────────────────────────────────────────────

interface SlidePanelProps {
  open: boolean
  children: React.ReactNode
  panelRef?: React.RefObject<HTMLDivElement | null>
}

export function SlidePanel({ open, children, panelRef }: SlidePanelProps) {
  return (
    <div
      ref={panelRef}
      className={`slide-panel${open ? ' open' : ''}`}
    >
      {children}
    </div>
  )
}

// ── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  children: React.ReactNode
}

export function Toast({ children }: ToastProps) {
  return <div className="toast">{children}</div>
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className="toast-container">{children}</div>
}

// ── SendIcon ─────────────────────────────────────────────────────────────────
// SVG arrow — 18×18, 1.5px stroke, currentColor. Single symbol. (Ive/Rams)

export function SendIcon() {
  return (
    <svg
      className="icon-send"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <line x1="4" y1="9" x2="14" y2="9" />
      <polyline points="10,5 14,9 10,13" />
    </svg>
  )
}
