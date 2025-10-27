import { useState, useEffect } from "react";

const geoCache = new Map();
const CACHE_TTL = 5 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "geocode_cache";

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([key, val]) => {
      if (Date.now() - val.time < CACHE_TTL) {
        geoCache.set(key, val);
      }
    });
  }
} catch (e) {
  console.error("Erro ao carregar cache:", e);
}

setInterval(() => {
  try {
    const cacheObj = {};
    geoCache.forEach((val, key) => {
      if (Date.now() - val.time < CACHE_TTL) {
        cacheObj[key] = val;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
  } catch (e) {}
}, 60 * 1000);

const requestQueue = [];
let activeRequests = 0;
const MAX_CONCURRENT = 30;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 50;

async function processQueue() {
  while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT) {
    const { lat, lon, resolve, reject } = requestQueue.shift();

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((r) =>
        setTimeout(r, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    lastRequestTime = Date.now();

    activeRequests++;

    try {
      const result = await fetchGeocode(lat, lon);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      activeRequests--;
      processQueue();
    }
  }
}

function formatarEndereco(displayName) {
  const partes = displayName.split(", ");

  const relevantes = partes.filter(
    (parte) =>
      !parte.includes("Região") &&
      !parte.includes("Brasil") &&
      !parte.includes("Brazil") &&
      !/^\d{5}-\d{3}$/.test(parte)
  );

  return relevantes.slice(0, 4).join(", ");
}

async function fetchGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=17&addressdetails=1`,
      {
        signal: AbortSignal.timeout(3000),
        headers: {
          "User-Agent": "TCC-SGA-Frontend/1.0",
        },
      }
    );

    if (!response.ok) throw new Error("Geocoding falhou");

    const data = await response.json();

    return formatarEndereco(data.display_name);
  } catch (err) {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(6)},${lon.toFixed(6)}`;

  const cached = geoCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.endereco;
  }

  return new Promise((resolve, reject) => {
    requestQueue.push({
      lat,
      lon,
      resolve: (endereco) => {
        geoCache.set(cacheKey, { endereco, time: Date.now() });
        resolve(endereco);
      },
      reject,
    });
    processQueue();
  });
}

export function useReverseGeocode(lat, lon, options = {}) {
  const { enabled = true, format = "full" } = options;
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || !lat || !lon) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(false);

    reverseGeocode(lat, lon)
      .then((endereco) => {
        if (format === "coords") {
          setAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        } else if (format === "short") {
          const partes = endereco.split(", ");
          setAddress(partes.slice(0, 2).join(", "));
        } else {
          setAddress(endereco);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setIsLoading(false);
      });
  }, [lat, lon, enabled, format]);

  return { address, isLoading, error };
}

export function clearGeocodeCache() {
  geoCache.clear();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}
