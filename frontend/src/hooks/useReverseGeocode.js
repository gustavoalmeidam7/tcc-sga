import { useState, useEffect } from "react";
import { toast } from "sonner";

const geoCache = new Map();
const CACHE_TTL = 5 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "geocode_cache";
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

let fallbackToastShown = false;

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
const MAX_CONCURRENT = 5;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 220;

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

async function fetchNominatim(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR&zoom=18`,
      {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "TCC-SGA-Frontend/1.0",
        },
      }
    );

    if (!response.ok) throw new Error("Nominatim falhou");

    const data = await response.json();
    const addr = data.address || {};

    const partes = [];

    const nomeEstabelecimento = addr.amenity || addr.building || addr.name;

    if (nomeEstabelecimento && nomeEstabelecimento !== addr.road) {
      partes.push(nomeEstabelecimento);
    }

    if (addr.road) partes.push(addr.road);

    const bairro =
      addr.suburb || addr.neighbourhood || addr.district || addr.quarter;
    if (bairro) partes.push(bairro);

    if (addr.city || addr.town || addr.municipality) {
      partes.push(addr.city || addr.town || addr.municipality);
    }

    const valoresRegionais = [
      "Southeast",
      "South",
      "Northeast",
      "North",
      "Central-West",
      "Sudeste",
      "Sul",
      "Nordeste",
      "Norte",
      "Centro-Oeste",
    ];
    if (addr.state && !valoresRegionais.includes(addr.state)) {
      partes.push(addr.state);
    }

    const partesUnicas = [];
    const vistos = new Set();

    for (const parte of partes) {
      const normalizado = parte.toLowerCase().trim();
      if (!vistos.has(normalizado)) {
        vistos.add(normalizado);
        partesUnicas.push(parte);
      }
    }

    return (
      partesUnicas.slice(0, 5).join(", ") ||
      `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    );
  } catch (err) {
    console.error("Nominatim fallback falhou:", err);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

async function fetchGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}&lang=pt`,
      {
        signal: AbortSignal.timeout(3000),
      }
    );

    if (response.status === 429) {
      if (!fallbackToastShown) {
        toast.info("Limite de requisições atingido", {
          description:
            "Usando servidor alternativo para continuar funcionando.",
          duration: 5000,
        });
        fallbackToastShown = true;
      }
      return await fetchNominatim(lat, lon);
    }

    if (!response.ok) throw new Error("Geocoding falhou");

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      let selectedFeature = data.features[0];

      for (const feature of data.features.slice(0, 5)) {
        const props = feature.properties;
        const nome = (props.name || "").toLowerCase();

        const palavrasChavePOI = [
          "hospital",
          "unimed",
          "escola",
          "posto",
          "clinica",
          "clinic",
          "santa casa",
          "pronto",
          "upa",
          "centro",
          "instituto",
          "faculdade",
          "universidade",
          "igreja",
          "shopping",
          "mercado",
          "farmácia",
          "pharmacy",
        ];

        const isPOI =
          props.amenity ||
          (props.building && props.building !== "yes") ||
          palavrasChavePOI.some((palavra) => nome.includes(palavra));

        if (props.name && props.name !== props.street && isPOI) {
          selectedFeature = feature;
          break;
        }
      }

      const props = selectedFeature.properties;

      const partes = [];

      if (props.name && props.name !== props.street) {
        partes.push(props.name);
      }

      if (props.street) partes.push(props.street);

      const bairro =
        props.suburb ||
        props.district ||
        props.neighbourhood ||
        props.quarter ||
        props.city_district;
      if (bairro) partes.push(bairro);

      if (props.city) partes.push(props.city);

      const estado = props.state_code || props.state;
      const valoresRegionais = [
        "Southeast",
        "South",
        "Northeast",
        "North",
        "Central-West",
        "Sudeste",
        "Sul",
        "Nordeste",
        "Norte",
        "Centro-Oeste",
      ];
      if (estado && !valoresRegionais.includes(estado)) {
        partes.push(estado);
      }

      const partesUnicas = [];
      const vistos = new Set();

      for (const parte of partes) {
        const normalizado = parte.toLowerCase().trim();
        if (!vistos.has(normalizado)) {
          vistos.add(normalizado);
          partesUnicas.push(parte);
        }
      }

      return partesUnicas.slice(0, 5).join(", ");
    }

    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (err) {
    if (!fallbackToastShown) {
      toast.info("Servidor alternativo em uso", {
        description: "Endereços sendo carregados normalmente.",
        duration: 4000,
      });
      fallbackToastShown = true;
    }
    return await fetchNominatim(lat, lon);
  }
}

export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;

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
