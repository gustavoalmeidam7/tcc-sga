import { useState, useRef, useEffect } from "react";

const geocodingCache = new Map();
const CACHE_EXPIRY_MS = 1000 * 60 * 10;

export function useGeocodingAutocomplete() {
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const formatarEndereco = (displayName) => {
    const partes = displayName.split(", ");

    const relevantes = partes.filter(
      (parte) =>
        !parte.includes("Região") &&
        !parte.includes("Brasil") &&
        !parte.includes("Brazil") &&
        !/^\d{5}-\d{3}$/.test(parte)
    );

    return relevantes.slice(0, 4).join(", ");
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
      const saoCarlosBbox = "-47.9530,-22.0470,-47.8298,-21.9706";
      const timeout = 8000;

      const fetchWithTimeout = async (url) => {
        const timeoutId = setTimeout(
          () => abortControllerRef.current.abort(),
          timeout
        );
        try {
          const response = await fetch(url, { signal });
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      const [dataSaoCarlos, dataBrasil] = await Promise.all([
        fetchWithTimeout(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            texto + ", São Carlos, SP"
          )}&limit=5&countrycodes=br&viewbox=${saoCarlosBbox}&bounded=1&addressdetails=1`
        ),
        fetchWithTimeout(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            texto
          )}&limit=5&countrycodes=br&addressdetails=1`
        ),
      ]);

      const todosDados = [...dataSaoCarlos, ...dataBrasil];

      const dadosUnicos = todosDados.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.lat === item.lat && t.lon === item.lon)
      );

      const sugestoesBrasil = dadosUnicos.slice(0, 10).map((item) => ({
        nome: formatarEndereco(item.display_name),
        nomeCompleto: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));

      geocodingCache.set(cacheKey, {
        data: sugestoesBrasil,
        timestamp: Date.now(),
      });

      if (geocodingCache.size > 100) {
        const firstKey = geocodingCache.keys().next().value;
        geocodingCache.delete(firstKey);
      }

      setSugestoes(sugestoesBrasil);
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      console.error("Erro ao buscar sugestões:", err);
      setSugestoes([]);
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
