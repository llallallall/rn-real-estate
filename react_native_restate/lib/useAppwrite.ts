import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params : initialParams = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

    const [currentParams, setCurrentParams] = useState<P>(initialParams);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

        // fetchParams가 변경되면 저장해 둡니다. (선택적)
        // setCurrentParams(fetchParams);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
        // 초기에는 initialParams로 호출
        fetchData(initialParams);
    }
  }, []);

  const refetch = async (newParams?: P) =>

      // await fetchData(newParams);
  {
      // newParams가 제공되면 currentParams를 업데이트합니다.
      const paramsToUse = newParams ?? currentParams;
      if (newParams) {
          setCurrentParams(newParams);
      }
      await fetchData(paramsToUse);

  }
  return { data, loading, error, refetch };
};
