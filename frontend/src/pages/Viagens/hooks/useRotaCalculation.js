import { useEffect, useRef } from "react";

export function useRotaCalculation(coordOrigem, coordDestino, onRotaCalculada) {
  const debounceTimerRef = useRef(null);

  const calcularRota = async (origem, destino) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origem[1]},${origem[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        const distanciaKm = (data.routes[0].distance / 1000).toFixed(1);
        const duracaoMin = Math.ceil(data.routes[0].duration / 60);

        return {
          coordinates,
          distancia: distanciaKm,
          duracao: duracaoMin,
        };
      }
      return null;
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
      return null;
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (coordOrigem && coordDestino) {
      debounceTimerRef.current = setTimeout(async () => {
        const resultado = await calcularRota(coordOrigem, coordDestino);
        if (resultado && onRotaCalculada) {
          onRotaCalculada(resultado);
        }
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [coordOrigem, coordDestino]);

  return { calcularRota };
}
