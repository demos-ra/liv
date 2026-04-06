// @liv-standard v1.3
// [F-design-system/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-form-classes
// slice:      F-design-system
// layer:      R3
// wires-in:   none
// wires-out:
//   W-ATOM  Brand           → F-identity/R3, core/app/R4
//   W-ATOM  InputContainer  → F-identity/R3, F-chat/R3, F-user-profile/R3
//   W-ATOM  SendIcon        → F-identity/R3, F-chat/R3
//   W-ATOM  Spinner         → F-identity/R3, F-chat/R3
//   W-ATOM  ButtonText      → F-user-profile/R3
//   W-ATOM  Label           → F-user-profile/R3
//   W-ATOM  StatusDot       → core/app/R4, F-user-profile/R3, F-planner/R3
//   W-ATOM  Overlay         → (declared, no active consumer)
//   W-ATOM  SlidePanel      → (declared, no active consumer)
//   W-ATOM  Button          → (declared, no active consumer)
//   W-ATOM  ButtonIcon      → (declared, no active consumer)
//   W-ATOM  Text            → (declared, no active consumer)
//   W-ATOM  Heading         → (declared, no active consumer)
//   W-ATOM  Badge           → (declared, no active consumer)
//   W-ATOM  Divider         → (declared, no active consumer)
//   W-ATOM  Surface         → F-dashboard/R3
//   W-ATOM  Toast           → (declared, no active consumer)
//   W-ATOM  ToastContainer  → (declared, no active consumer)
// deps:
//   R5  react
// validated: pending
//
// phase3-form-classes (A3):
//   InputContainer: added optional className prop to typed boundary.
//   Applied to outer div for .form class participation in dissolve/form
//   entrance animations.

import { forwardRef } from 'react'

// ── Brand ────────────────────────────────────────────────────────────────────

type BrandVariant = 'header' | 'login'

export function Brand({ variant, className }: { variant: BrandVariant; className?: string }) {
  if (variant === 'login') {
    return (
      <div className="login-brand">
        <span className={className ? `brand ${className}` : 'brand'}>LIV</span>
      </div>
    )
  }
  return <span className={className ? `brand ${className}` : 'brand'}>LIV</span>
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

type ButtonTextVariant = 'accent' | 'danger' | 'signout'

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
  className?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readOnly?: boolean
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
      className,
      placeholder,
      type = 'text',
      disabled,
      readOnly,
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
      <div className={className ? `input-container ${className}` : 'input-container'} ref={ref}>
        <input
          ref={inputRef}
          className="input-bare"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
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
      className={size === 'sm' ? 'icon-spinner spinner-sm' : 'icon-spinner'}
      role="status"
      aria-label="Loading"
    />
  )
}

// ── StatusDot ────────────────────────────────────────────────────────────────

type DotStatus = 'accent' | 'error' | 'dis'

export function StatusDot({ status, className }: { status: DotStatus; className?: string }) {
  const base = `dot dot-${status}`
  return <div className={className ? `${base} ${className}` : base} />
}

// ── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'accent' | 'error'

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
      viewBox="0 0 256 256"
      fill="currentColor"
      width="18" height="18"
      aria-hidden="true"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,109.66-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,173.66,133.66Z"/>
    </svg>
  )
}
