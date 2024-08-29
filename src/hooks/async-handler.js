import { useCallback } from "react";
import { useLoading } from "@/src/context/loading-context";

export function useAsyncHandler() {
  const { startLoading, stopLoading } = useLoading();

  return useCallback(
    async (asyncFunc) => {
      startLoading();
      try {
        return await asyncFunc();
      } catch (error) {
        console.error("Error:", error);
        throw error;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );
}
