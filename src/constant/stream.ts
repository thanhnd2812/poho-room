export const DEFAULT_CHANNEL_TYPE = "messaging";
export const DEFAULT_AI_USER_ID = "PAI";
export enum AI_PROVIDERS {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  DEFAULT = OPENAI,
}
export const STREAM_AI_CHANNEL_EVENT_TYPE = "gpt_chunk";
export const AI_HISTORY_LIMIT_MESSAGES = 50;
export const CHAT_GPT_MODEL = "gpt-4o";