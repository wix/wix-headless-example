import { createContext, useCallback, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(
    () => setLoadingCount((count) => count + 1),
    [],
  );
  const stopLoading = useCallback(
    () => setLoadingCount((count) => count - 1),
    [],
  );

  return (
    <LoadingContext.Provider
      value={{ isLoading: loadingCount > 0, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
