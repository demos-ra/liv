// [F-terminal-bridge/R0/C3] Terminal event declarations — owned by this slice
export const TERMINAL_EVENTS = {
  COMMAND_SENT:    'terminal.command-sent',
  OUTPUT_RECEIVED: 'terminal.output-received',
  BRIDGE_ERROR:    'terminal.bridge-error',
  CONNECTED:       'terminal.connected',
  STUBBED:         'terminal.stubbed',
} as const
export type TerminalEventType = typeof TERMINAL_EVENTS[keyof typeof TERMINAL_EVENTS]
