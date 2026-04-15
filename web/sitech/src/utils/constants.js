export const CHANNEL_TYPES = {
  1: { label: 'OpenAI', value: 1 },
  2: { label: 'API2D', value: 2 },
  3: { label: 'Azure OpenAI', value: 3 },
  4: { label: 'CloseAI', value: 4 },
  5: { label: 'OpenAI SB', value: 5 },
  6: { label: 'OpenAI Max', value: 6 },
  7: { label: 'OhMyGPT', value: 7 },
  9: { label: 'AIGC2D', value: 9 },
  10: { label: 'AIProxy', value: 10 },
  11: { label: 'Google PaLM2', value: 11 },
  14: { label: 'Anthropic Claude', value: 14 },
  15: { label: 'Baidu', value: 15 },
  16: { label: 'Zhipu', value: 16 },
  17: { label: 'Ali', value: 17 },
  18: { label: 'Xunfei', value: 18 },
  19: { label: '360 AI', value: 19 },
  20: { label: 'OpenRouter', value: 20 },
  23: { label: 'Tencent', value: 23 },
  24: { label: 'Google Gemini', value: 24 },
  25: { label: 'Moonshot', value: 25 },
  26: { label: 'Baichuan', value: 26 },
  27: { label: 'MiniMax', value: 27 },
  28: { label: 'Mistral AI', value: 28 },
  29: { label: 'Groq', value: 29 },
  30: { label: 'Ollama', value: 30 },
  31: { label: 'LingYiWanWu', value: 31 },
  32: { label: 'StepFun', value: 32 },
  33: { label: 'AWS Claude', value: 33 },
  34: { label: 'Coze', value: 34 },
  35: { label: 'Cohere', value: 35 },
  36: { label: 'DeepSeek', value: 36 },
  37: { label: 'Cloudflare', value: 37 },
  38: { label: 'DeepL', value: 38 },
  39: { label: 'TogetherAI', value: 39 },
  40: { label: 'Doubao', value: 40 },
  41: { label: 'Novita', value: 41 },
  43: { label: 'SiliconFlow', value: 43 },
  44: { label: 'xAI', value: 44 },
  45: { label: 'Replicate', value: 45 },
  47: { label: 'Baidu V2', value: 47 },
  48: { label: 'Xunfei V2', value: 48 },
  49: { label: 'Ali Bailian', value: 49 },
  50: { label: 'OpenAI Compatible', value: 50 },
  51: { label: 'Gemini Compatible', value: 51 },
  52: { label: 'Custom', value: 52 }
}

export const CHANNEL_STATUS = {
  0: { label: '未知', type: 'info' },
  1: { label: '启用', type: 'success' },
  2: { label: '手动禁用', type: 'warning' },
  3: { label: '自动禁用', type: 'danger' }
}

export const TOKEN_STATUS = {
  1: { label: '启用', type: 'success' },
  2: { label: '禁用', type: 'warning' },
  3: { label: '已过期', type: 'info' },
  4: { label: '额度用尽', type: 'danger' }
}

export const USER_ROLES = {
  0: { label: '游客', value: 0 },
  1: { label: '普通用户', value: 1 },
  10: { label: '管理员', value: 10 },
  100: { label: '超级管理员', value: 100 }
}

export const USER_STATUS = {
  1: { label: '启用', type: 'success' },
  2: { label: '禁用', type: 'warning' },
  3: { label: '已删除', type: 'danger' }
}

export const LOG_TYPES = {
  1: { label: '充值', type: 'success' },
  2: { label: '消费', type: 'primary' },
  3: { label: '管理', type: 'warning' },
  4: { label: '系统', type: 'info' },
  5: { label: '测试', type: 'success' }
}

export const REDEMPTION_STATUS = {
  1: { label: '可用', type: 'success' },
  2: { label: '禁用', type: 'warning' },
  3: { label: '已使用', type: 'info' }
}

export function formatQuota(quota) {
  if (quota >= 1e12) return (quota / 1e12).toFixed(2) + 'T'
  if (quota >= 1e9) return (quota / 1e9).toFixed(2) + 'B'
  if (quota >= 1e6) return (quota / 1e6).toFixed(2) + 'M'
  if (quota >= 1e3) return (quota / 1e3).toFixed(2) + 'K'
  return quota.toString()
}

export function formatDate(timestamp) {
  if (!timestamp || timestamp === -1) return '永久'
  return new Date(timestamp * 1000).toLocaleString('zh-CN')
}

export function formatDateTime(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}
