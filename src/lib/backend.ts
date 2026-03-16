const laravelUrl =
  (((typeof import.meta !== "undefined" ? import.meta.env?.VITE_LARAVEL_URL : undefined) as string | undefined) ?? "").replace(
    /\/$/,
    "",
  );

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export const buildApiUrl = (path: string) => {
  const normalizedPath = normalizePath(path);
  return laravelUrl ? `${laravelUrl}${normalizedPath}` : normalizedPath;
};

export const getAdminUrl = () => {
  const explicitAdminUrl = (
    (typeof import.meta !== "undefined" ? import.meta.env?.VITE_ADMIN_URL : undefined) as string | undefined
  )?.trim();
  if (explicitAdminUrl) {
    return explicitAdminUrl;
  }

  return laravelUrl ? `${laravelUrl}/admin` : "http://127.0.0.1:8000/admin";
};

export const resolveBackendMediaUrl = (value?: string | null) => {
  if (!value) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/storage") && laravelUrl) {
    return `${laravelUrl}${value}`;
  }

  if (!value.startsWith("/")) {
    return laravelUrl ? `${laravelUrl}/storage/${value}` : `/storage/${value}`;
  }

  return value;
};

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
