import { useEffect, useRef, useCallback, useState } from "react";
import { RouteCacheService } from "@/src/services/routeCache";

const GEOAPIFY_API_KEY = "aebbd6003ace495cb8242038b45cf6ca";

const traduzirInstrucao = (instrucao) => {
  if (!instrucao) return instrucao;

  let texto = instrucao.toLowerCase();

  const traducoes = {
    drive: "siga",
    turn: "vire",
    left: "à esquerda",
    right: "à direita",
    northwest: "noroeste",
    northeast: "nordeste",
    southwest: "sudoeste",
    southeast: "sudeste",
    north: "norte",
    south: "sul",
    east: "leste",
    west: "oeste",
    onto: "para",
    continue: "continue",
    straight: "em frente",
    on: "na",
    at: "na",
    roundabout: "rotatória",
    exit: "saída",
    keep: "mantenha",
    go: "vá",
    head: "siga",
    take: "pegue",
    merge: "incorpore",
    follow: "siga",
    destination: "destino",
    "will be": "estará",
    arrive: "chegue",
  };

  Object.keys(traducoes).forEach((en) => {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    texto = texto.replace(regex, traducoes[en]);
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
export function useGeoapifyRouting(
  coordOrigem,
  coordDestino,
  onRotaCalculada,
  options = {}
) {
  const { enabled = true, updateInterval = null } = options;
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const onRotaCalculadaRef = useRef(onRotaCalculada);
  const isFirstCallRef = useRef(true);
  const lastCoordsRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onRotaCalculadaRef.current = onRotaCalculada;
  }, [onRotaCalculada]);

  const calcularRota = useCallback(async (origem, destino, retryCount = 0) => {
    const cachedRoute = await RouteCacheService.getRoute(origem, destino);
    if (cachedRoute) {
      return cachedRoute;
    }

    const maxRetries = 1;
    const timeout = 5000;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      setError(null);

      const timeoutId = setTimeout(
        () => abortControllerRef.current?.abort(),
        timeout
      );

      const waypoints = `${origem[0]},${origem[1]}|${destino[0]},${destino[1]}`;
      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${GEOAPIFY_API_KEY}&details=instruction_details&lang=pt`;

      const response = await fetch(url, { signal });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error(
          "Rate limit excedido. Tente novamente em alguns instantes."
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const geometry = route.geometry;
        let rawCoordinates = [];

        if (geometry.type === "LineString") {
          rawCoordinates = geometry.coordinates;
        } else if (geometry.type === "MultiLineString") {
          rawCoordinates = geometry.coordinates.flat();
        }

        const coordinates = rawCoordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        const properties = route.properties || {};
        const distanciaKm = properties.distance
          ? (properties.distance / 1000).toFixed(1)
          : null;
        const duracaoMin = properties.time
          ? Math.ceil(properties.time / 60)
          : null;

        const instructions =
          properties.legs?.[0]?.steps?.map((step) => {
            let instrucaoTexto = step.instruction?.text || "";

            if (
              instrucaoTexto &&
              /^(drive|turn|head|go|take|continue)/i.test(instrucaoTexto)
            ) {
              instrucaoTexto = traduzirInstrucao(instrucaoTexto);
            }

            return {
              instruction: instrucaoTexto,
              distance: step.distance,
              duration: step.duration,
            };
          }) || [];

        const resultado = {
          coordinates,
          distancia: distanciaKm,
          duracao: duracaoMin,
          instructions,
          geometry: geometry.coordinates,
        };

        await RouteCacheService.saveRoute(origem, destino, resultado);

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
        `Erro ao calcular rota com Geoapify (tentativa ${retryCount + 1}/${maxRetries + 1}):`,
        err
      );

      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return calcularRota(origem, destino, retryCount + 1);
      }

      setError(err.message || "Erro ao calcular rota. Tente novamente.");
      setIsLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (
      coordOrigem &&
      coordDestino &&
      coordOrigem.length === 2 &&
      coordDestino.length === 2
    ) {
      const coordsKey = `${coordOrigem[0]},${coordOrigem[1]},${coordDestino[0]},${coordDestino[1]}`;
      const lastKey = lastCoordsRef.current;

      let shouldRecalculate = false;
      if (!lastKey || lastKey !== coordsKey) {
        if (lastKey) {
          const [lastOrigLat, lastOrigLon] = lastKey.split(',');
          const distance = Math.sqrt(
            Math.pow(coordOrigem[0] - parseFloat(lastOrigLat), 2) +
            Math.pow(coordOrigem[1] - parseFloat(lastOrigLon), 2)
          );
          shouldRecalculate = isFirstCallRef.current || distance > 0.0005;
        } else {
          shouldRecalculate = true;
        }
      }

      if (shouldRecalculate) {
        lastCoordsRef.current = coordsKey;

        const delay = isFirstCallRef.current ? 0 : (updateInterval !== null ? updateInterval : 10000);

        const executeCalculation = async () => {
          const resultado = await calcularRota(coordOrigem, coordDestino);
          if (resultado && onRotaCalculadaRef.current) {
            onRotaCalculadaRef.current(resultado);
          }
          isFirstCallRef.current = false;
        };

        if (delay === 0) {
          executeCalculation();
        } else {
          debounceTimerRef.current = setTimeout(executeCalculation, delay);
        }
      }
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [coordOrigem, coordDestino, enabled, updateInterval, calcularRota]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { calcularRota, error, isLoading };
}
