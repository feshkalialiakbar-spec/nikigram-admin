export const safeText = (value?: string | number | null) =>
    value === null || value === undefined || String(value).trim() === '' ? '—' : String(value);
