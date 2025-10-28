import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const geocodingCache = new Map();
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "autocomplete_cache";
const MAX_CACHE_SIZE = 500;
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

let autocompleteFallbackToastShown = false;

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([key, val]) => {
      if (Date.now() - val.timestamp < CACHE_EXPIRY_MS) {
        geocodingCache.set(key, val);
      }
    });
  }
} catch (e) {
  console.error("Erro ao carregar cache de autocomplete:", e);
}

setInterval(() => {
  try {
    const cacheObj = {};
    geocodingCache.forEach((val, key) => {
      if (Date.now() - val.timestamp < CACHE_EXPIRY_MS) {
        cacheObj[key] = val;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
  } catch (e) {}
}, 120 * 1000);

export function useGeocodingAutocomplete() {
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const buscarNominatim = async (texto, signal) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        texto
      )},Brazil&format=json&addressdetails=1&limit=15&accept-language=pt-BR`,
      {
        signal,
        headers: {
          "User-Agent": "TCC-SGA-Frontend/1.0",
        },
      }
    );

    if (!response.ok) throw new Error("Nominatim falhou");

    const data = await response.json();

    return data.map((result) => {
      const addr = result.address || {};
      const partes = [];

      if (addr.amenity) partes.push(addr.amenity);
      if (addr.road) partes.push(addr.road);
      if (addr.suburb || addr.neighbourhood)
        partes.push(addr.suburb || addr.neighbourhood);
      if (addr.city || addr.town) partes.push(addr.city || addr.town);
      if (addr.state) partes.push(addr.state);

      return {
        nome: partes.slice(0, 3).join(", ") || result.display_name,
        nomeCompleto: partes.join(", ") || result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      };
    });
  };

  const formatarEndereco = (props) => {
    const partes = [];
    if (props.name && props.name !== props.street) partes.push(props.name);
    if (props.street) partes.push(props.street);
    if (props.suburb || props.district)
      partes.push(props.suburb || props.district);
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

    return partes.slice(0, 5).join(", ");
  };

  const buscarSugestoes = async (texto) => {
    if (texto.length < 3) {
      setSugestoes([]);
      setIsLoading(false);
      return;
    }

    const cacheKey = texto.toLowerCase().trim();
    const cached = geocodingCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
      setSugestoes(cached.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const timeout = 8000;

      const fetchWithTimeout = async (url) => {
        const timeoutId = setTimeout(
          () => abortControllerRef.current.abort(),
          timeout
        );
        try {
          const response = await fetch(url, { signal });
          clearTimeout(timeoutId);

          if (response.status === 429) {
            if (!autocompleteFallbackToastShown) {
              toast.info("Limite de requisições atingido", {
                description:
                  "Usando servidor alternativo para buscar endereços.",
                duration: 5000,
              });
              autocompleteFallbackToastShown = true;
            }
            return null;
          }

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      const data = await fetchWithTimeout(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          texto
        )}&filter=countrycode:br&bias=proximity:-47.890,-21.988&limit=15&apiKey=${GEOAPIFY_API_KEY}`
      );

      if (data === null) {
        const sugestoesNominatim = await buscarNominatim(texto, signal);
        geocodingCache.set(cacheKey, {
          data: sugestoesNominatim,
          timestamp: Date.now(),
        });
        setSugestoes(sugestoesNominatim);
        setIsLoading(false);
        return;
      }

      if (!data.features || data.features.length === 0) {
        setSugestoes([]);
        setIsLoading(false);
        return;
      }

      const sugestoesBrasil = data.features.map((feature) => ({
        nome: formatarEndereco(feature.properties),
        nomeCompleto:
          feature.properties.formatted || formatarEndereco(feature.properties),
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      }));

      geocodingCache.set(cacheKey, {
        data: sugestoesBrasil,
        timestamp: Date.now(),
      });

      if (geocodingCache.size > MAX_CACHE_SIZE) {
        const firstKey = geocodingCache.keys().next().value;
        geocodingCache.delete(firstKey);
      }

      setSugestoes(sugestoesBrasil);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      if (!autocompleteFallbackToastShown) {
        toast.info("Servidor alternativo em uso", {
          description: "Buscando endereços normalmente.",
          duration: 4000,
        });
        autocompleteFallbackToastShown = true;
      }
      try {
        const sugestoesNominatim = await buscarNominatim(texto, signal);
        geocodingCache.set(cacheKey, {
          data: sugestoesNominatim,
          timestamp: Date.now(),
        });
        setSugestoes(sugestoesNominatim);
      } catch (nominatimErr) {
        toast.error("Erro ao buscar endereços", {
          description: "Tente novamente em alguns instantes.",
          duration: 4000,
        });
        setSugestoes([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setShowSugestoes(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      buscarSugestoes(value);
    }, 300);
  };

  const handleKeyDown = (e, onSelect) => {
    if (e.key === "Enter" && sugestoes.length > 0) {
      e.preventDefault();
      onSelect(sugestoes[0]);
      setShowSugestoes(false);
      setSugestoes([]);
    }
  };

  const handleSugestaoClick = (sugestao, onSelect) => {
    onSelect(sugestao);
    setShowSugestoes(false);
    setSugestoes([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSugestoes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    sugestoes,
    showSugestoes,
    isLoading,
    inputRef,
    handleInputChange,
    handleKeyDown,
    handleSugestaoClick,
    setShowSugestoes,
  };
}
