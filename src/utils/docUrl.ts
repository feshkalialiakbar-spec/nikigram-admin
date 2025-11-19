// utils/docUrl.ts
type Protocol = "http" | "https";

/**
 * مقدار محیط را فقط در زمان نیاز می‌خوانیم تا در همه محیط‌ها درست کار کند.
 */
const getRawDocUrl = (): string => {
  const docUrl = process.env.NEXT_PUBLIC_DOC_URL?.trim();
  if (docUrl) return docUrl;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl) return apiUrl;
  return "";
};

/**
 * اطمینان از اینکه URL حتماً پروتکل دارد.
 */
const normalizeUrl = (raw: string): string => {
  if (!raw) return "";
  if (/^[a-zA-Z]+:\/\//.test(raw)) return raw;
  return `https://${raw}`;
};

/**
 * پارس امن URL
 */
const safeParseUrl = (raw: string): URL | null => {
  try {
    const normalized = normalizeUrl(raw);
    return new URL(normalized);
  } catch {
    return null;
  }
};

/**
 * ساخت base از URL پارس‌شده
 */
const buildBaseFromUrl = (url: URL | null): string => {
  if (!url) return "";
  return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
};

/**
 * افزودن مسیر دانلود
 */
const ensureDownloadBase = (base: string): string => {
  if (!base) return "";
  return base.endsWith("/api/sys/files/download")
    ? base
    : `${base.replace(/\/+$/, "")}/api/sys/files/download`;
};

/**
 * بازسازی URL دانلود
 */
export const buildDocDownloadUrl = (value?: string | null): string => {
  if (!value) return "";

  // اگر مقدار ورودی خودش یک URL کامل باشد، همان را برمی‌گردانیم
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const rawBase = getRawDocUrl();
  const parsed = safeParseUrl(rawBase);
  const docBase = buildBaseFromUrl(parsed);
  const downloadBase = ensureDownloadBase(docBase);

 
  // استخراج slug و search
  const [pathPart, searchPart] = value.split("?");
  const slug = pathPart.replace(/^\/?api\/sys\/files\/download\/?/, "").replace(/^\/+/, "");
  const search = searchPart ? `?${searchPart}` : "";

  if (downloadBase) {
    return `${downloadBase}/${slug}${search}`;
  }

  // fallback
  return `/api/sys/files/download/${slug}${search}`;
};

/**
 * بررسی وجود مقدار معتبر
 */
export const hasDocBaseUrl = (): boolean => {
  const raw = getRawDocUrl();
  return Boolean(safeParseUrl(raw));
};

/**
 * گرفتن الگوی Remote Pattern برای next/image
 */
export const getDocRemotePattern = () => {
  const raw = getRawDocUrl();
  const parsed = safeParseUrl(raw);
  if (!parsed) return null;
  const protocol = parsed.protocol.replace(":", "") as Protocol;
  return {
    protocol,
    hostname: parsed.hostname,
    ...(parsed.port ? { port: parsed.port } : {}),
  };
};

/**
 * گرفتن base URL (مثلاً برای نمایش یا دیباگ)
 */
export const getDocBaseUrl = (): string => {
  const raw = getRawDocUrl();
  const parsed = safeParseUrl(raw);
  return buildBaseFromUrl(parsed);
};
