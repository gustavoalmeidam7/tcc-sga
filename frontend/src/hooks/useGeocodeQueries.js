import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { reverseGeocode } from "@/hooks/useReverseGeocode";

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
        const key = `${start.lat},${start.long}`;
        if (!coordsMap.has(key)) {
          coordsMap.set(key, { lat: start.lat, long: start.long });
        }
      }

      if (end.lat && end.long) {
        const key = `${end.lat},${end.long}`;
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
      queryFn: () => reverseGeocode(coord.lat, coord.long),
      staleTime: 1000 * 60 * 60 * 24,
      cacheTime: 1000 * 60 * 60 * 24 * 7,
    })),
  });

  const geocodeMap = useMemo(() => {
    const map = new Map();
    uniqueCoordinates.forEach((coord, index) => {
      const key = `${coord.lat},${coord.long}`;
      map.set(key, geocodeQueries[index]?.data);
    });
    return map;
  }, [uniqueCoordinates, geocodeQueries]);

  const isLoading = geocodeQueries.some((query) => query.isLoading);

  return {
    geocodeMap,
    isLoading,
    getAddress: (lat, long) => geocodeMap.get(`${lat},${long}`) || null,
  };
}
