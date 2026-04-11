// @liv-standard v1.3
// [F-design-system/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-design-system.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   (none — F-design-system has zero cross-slice imports)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-ATOM  Brand, Button, ButtonText, InputContainer, Label, Text, Heading  →  contract/primitives
//   W-ATOM  Spinner, StatusDot, Badge, Divider, Surface                      →  contract/primitives
//   W-ATOM  Overlay, SlidePanel, Toast, ToastContainer, SendIcon             →  contract/primitives
//   Consumers:
//     F-chat/R3 (chat-ui)
//     F-dashboard/R3 (dashboard-ui)
//     F-identity/R3 (auth-pages)
//     F-planner/R3 (planner-ui)
//     F-user-profile/R3 (account-page)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
