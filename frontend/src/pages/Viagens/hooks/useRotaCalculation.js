import { useEffect, useRef, useCallback, useState } from "react";

export function useRotaCalculation(coordOrigem, coordDestino, onRotaCalculada) {
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const onRotaCalculadaRef = useRef(onRotaCalculada);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onRotaCalculadaRef.current = onRotaCalculada;
  }, [onRotaCalculada]);

  const calcularRota = useCallback(async (origem, destino, retryCount = 0) => {
    const maxRetries = 2;
    const timeout = 8000;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      setError(null);

      const timeoutId = setTimeout(
        () => abortControllerRef.current.abort(),
        timeout
      );

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`,
        { signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        const distanciaKm = (data.routes[0].distance / 1000).toFixed(1);
        const duracaoMin = Math.ceil(data.routes[0].duration / 60);

        const resultado = {
          coordinates,
          distancia: distanciaKm,
          duracao: duracaoMin,
        };

        setIsLoading(false);
        return resultado;
      }

      setIsLoading(false);
      return null;
    } catch (err) {
      if (err.name === "AbortError") {
        return null;
      }

      console.error(
        `Erro ao calcular rota (tentativa ${retryCount + 1}/${
          maxRetries + 1
        }):`,
        err
      );

      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount); // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        return calcularRota(origem, destino, retryCount + 1);
      }

      setError("Erro ao calcular rota. Tente novamente.");
      setIsLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (coordOrigem && coordDestino) {
      debounceTimerRef.current = setTimeout(async () => {
        const resultado = await calcularRota(coordOrigem, coordDestino);
        if (resultado && onRotaCalculadaRef.current) {
          onRotaCalculadaRef.current(resultado);
        }
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [coordOrigem, coordDestino, calcularRota]);
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { calcularRota, error, isLoading };
}
