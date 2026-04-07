// @liv-standard v1.3
// [F-ai-adapter/R0]
// Built with LIV · livai.dev
// [F-ai-adapter/R0/C3] AI event declarations — owned by this slice
export const AI_EVENTS = {
  MESSAGE_SENT:     'ai.message-sent',
  MESSAGE_RECEIVED: 'ai.message-received',
  STREAM_STARTED:   'ai.stream-started',
  STREAM_ENDED:     'ai.stream-ended',
  STREAM_ERROR:     'ai.stream-error',
  ERROR:            'ai.error',
} as const
export type AIEventType = typeof AI_EVENTS[keyof typeof AI_EVENTS]
