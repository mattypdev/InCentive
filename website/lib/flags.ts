// Feature flags read from env — falsy by default so prod stays unchanged
// Set NEXT_PUBLIC_FLAG_ISLANDS=1 to enable M1 island navigation

export const FLAGS = {
  islands: process.env.NEXT_PUBLIC_FLAG_ISLANDS === '1',
  library: process.env.NEXT_PUBLIC_FLAG_LIBRARY === '1',
  wallet:  process.env.NEXT_PUBLIC_FLAG_WALLET  === '1',
} as const;

export type FlagKey = keyof typeof FLAGS;
