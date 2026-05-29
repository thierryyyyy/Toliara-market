/**
 * Shim getRuntimeConfig - PublicLayout + runtime (V1650 conserve ce fichier).
 */
export const getRuntimeConfig = () => {
  const envApiUrl = (import.meta as { env?: { VITE_CONSTRUCTOR_API_URL?: string } }).env
    ?.VITE_CONSTRUCTOR_API_URL;
  const envProjectId = (import.meta as { env?: { VITE_PROJECT_ID?: string } }).env?.VITE_PROJECT_ID;
  const windowApiUrl =
    typeof window !== "undefined" ? (window as { __CONSTRUCTOR_API_URL__?: string }).__CONSTRUCTOR_API_URL__ : "";
  const windowProjectId =
    typeof window !== "undefined" ? (window as { __PROJECT_ID__?: string }).__PROJECT_ID__ : "";

  let apiUrl = windowApiUrl || envApiUrl || '';
  let projectId = windowProjectId || envProjectId || '';

  if (typeof window !== "undefined") {
    if (!apiUrl && /\/projects\/[^/]+/i.test(window.location.pathname)) {
      apiUrl = window.location.origin;
    }
    if (!projectId) {
      const match = window.location.pathname.match(/\/projects\/([^/]+)/i);
      if (match?.[1]) projectId = match[1];
    }
  }

  return { apiUrl, projectId };
};

export function useRuntimeData() {
  return {
    data: {} as Record<string, unknown[]>,
    collections: [] as string[],
    isLoading: false,
    error: null as string | null,
    apiUrl: "",
    projectId: "",
    isConnected: false,
    initialized: false,
    initData: async () => {},
    updateData: async () => {},
    refreshData: async () => {},
  };
}

export default useRuntimeData;
