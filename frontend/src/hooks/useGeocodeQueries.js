import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchReverseGeocode } from "@/hooks/useReverseGeocode";

export function useGeocodeQueries(items, options = {}) {
  const {
    getStartCoords = (item) => ({
      lat: item.lat_inicio,
      long: item.long_inicio,
    }),
    getEndCoords = (item) => ({ lat: item.lat_fim, long: item.long_fim }),
  } = options;

  const uniqueCoordinates = useMemo(() => {
    if (!items || items.length === 0) return [];

    const coordsMap = new Map();

    items.forEach((item) => {
      const start = getStartCoords(item);
      const end = getEndCoords(item);

      if (start.lat && start.long) {
        const key = `${start.lat.toFixed(5)},${start.long.toFixed(5)}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: start.lat, long: start.long });
        }
      }

      if (end.lat && end.long) {
        const key = `${end.lat.toFixed(5)},${end.long.toFixed(5)}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: end.lat, long: end.long });
        }
      }
    });

    return Array.from(coordsMap.values());
  }, [items, getStartCoords, getEndCoords]);

  const geocodeQueries = useQueries({
    queries: uniqueCoordinates.map((coord) => ({
      queryKey: ["geocode", coord.lat, coord.long],
      queryFn: fetchReverseGeocode,
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24 * 7,
      retry: false,
    })),
  });

  const queriesData = geocodeQueries.map((q) => q.data);

  const geocodeMap = useMemo(() => {
    const map = new Map();
    uniqueCoordinates.forEach((coord, index) => {
      const key = `${coord.lat.toFixed(5)},${coord.long.toFixed(5)}`;
      map.set(key, queriesData[index]);
    });
    return map;
  }, [uniqueCoordinates, JSON.stringify(queriesData)]);

  const isLoading = geocodeQueries.some((query) => query.isLoading);
  const isSuccess = geocodeQueries.every((query) => query.isSuccess);

  return {
    geocodeMap,
    isLoading,
    isSuccess,
    getAddress: (lat, long) => {
      if (!lat || !long) return null;
      return geocodeMap.get(`${lat.toFixed(5)},${long.toFixed(5)}`) || null;
    },
  };
}
