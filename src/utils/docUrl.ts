type Protocol = "http" | "https";

const RAW_DOC_URL = `https://nikicity.com/api/sys/files/download/`


const normalizeRawUrl = (raw: string): string => {
  if (!raw) return "";
  if (/^[a-zA-Z]+:\/\//.test(raw)) {
    return raw;
  }
  return `http://${raw}`;
};

const safeParseUrl = (raw: string): URL | null => {
  const normalized = normalizeRawUrl(raw);
  if (!normalized) return null;
  try {
    return new URL(normalized);
  } catch {
    return null;
  }
};

const buildBaseFromUrl = (parsed: URL | null): string => {
  if (!parsed) return "";
  const origin = `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}`;
  return `${origin}${parsed.pathname.replace(/\/$/, "")}`;
};

const parsedDocUrl = safeParseUrl(RAW_DOC_URL);

const DOC_BASE = buildBaseFromUrl(parsedDocUrl);

const ensureDownloadBase = (base: string): string => {
  if (!base) return "";
  if (/\/api\/sys\/files\/download$/i.test(base)) {
    return base;
  }
  return `${base}/api/sys/files/download`;
};

const DOC_DOWNLOAD_BASE = ensureDownloadBase(DOC_BASE);

export const hasDocBaseUrl = (): boolean => Boolean(parsedDocUrl);

const buildRemotePattern = (parsed: URL | null) => {
  if (!parsed) return null;
  const protocol = parsed.protocol.replace(":", "") as Protocol;
  if (protocol !== "http" && protocol !== "https") {
    return null;
  }
  return {
    protocol,
    hostname: parsed.hostname,
    ...(parsed.port ? { port: parsed.port } : {}),
  } as {
    protocol: Protocol;
    hostname: string;
    port?: string;
  };
};

export const getDocRemotePattern = () => buildRemotePattern(parsedDocUrl);

const stripDownloadPrefix = (value: string): { slug: string; search: string } => {
  if (!value) {
    return { slug: "", search: "" };
  }

  try {
    const url = new URL(value);
    const pathname = url.pathname.replace(/^\/?api\/sys\/files\/download\/?/, "");
    return {
      slug: pathname.replace(/^\/+/, ""),
      search: url.search,
    };
  } catch {
    const [pathPart, searchPart] = value.split("?");
    const slug = pathPart.replace(/^\/?api\/sys\/files\/download\/?/, "").replace(/^\/+/, "");
    return {
      slug,
      search: searchPart ? `?${searchPart}` : "",
    };
  }
};

export const buildDocDownloadUrl = (value?: string | null): string => {
  if (!value) return "";
  const { slug, search } = stripDownloadPrefix(value);
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    console.debug("[docUrl] buildDocDownloadUrl inputs", {
      raw: value,
      docBase: DOC_BASE,
      downloadBase: DOC_DOWNLOAD_BASE,
      slug,
      search,
    });
  }

  if (DOC_DOWNLOAD_BASE) {
    const normalized = slug ? `${DOC_DOWNLOAD_BASE}/${slug}` : DOC_DOWNLOAD_BASE;
    if (!isProd) {
      console.debug("[docUrl] buildDocDownloadUrl resolved", normalized + search);
    }
    return `${normalized}${search}`;
  }

  if (/^https?:\/\//i.test(value)) {
    if (!isProd) {
      console.debug("[docUrl] buildDocDownloadUrl fallback absolute", value);
    }
    return value;
  }

  const fallback = value.startsWith("/")
    ? value
    : `/api/sys/files/download/${slug}${search}`;

  if (!isProd) {
    console.debug("[docUrl] buildDocDownloadUrl fallback relative", fallback);
  }

  return fallback;
};

export const getDocBaseUrl = (): string => DOC_BASE;


