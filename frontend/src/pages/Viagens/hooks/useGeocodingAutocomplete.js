import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

async function fetchFromGeoapify(text, signal) {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&filter=countrycode:br&bias=proximity:-47.890,-21.988&limit=10&apiKey=${GEOAPIFY_API_KEY}`,
    { signal }
  );
  if (response.status === 429) throw new Error("Rate limit");
  if (!response.ok) throw new Error("Geoapify autocomplete failed");

  const data = await response.json();
  if (!data.features || data.features.length === 0) return [];

  return data.features.map((feature) => ({
    nome: feature.properties.formatted,
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  }));
}

async function fetchFromNominatim(text, signal) {
  toast.info("Usando servidor de mapas alternativo.");
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      text
    )},Brazil&format=json&addressdetails=1&limit=10&accept-language=pt-BR`,
    { signal, headers: { "User-Agent": "TCC-SGA-Frontend/1.0" } }
  );
  if (!response.ok) throw new Error("Nominatim autocomplete failed");

  const data = await response.json();
  return data.map((result) => ({
    nome: result.display_name,
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
  }));
}

async function fetchSuggestions({ queryKey, signal }) {
  const [_key, searchTerm] = queryKey;
  if (!searchTerm) return [];

  try {
    return await fetchFromGeoapify(searchTerm, signal);
  } catch (error) {
    console.warn(
      "Geoapify autocomplete falhou, tentando Nominatim. Erro:",
      error.message
    );
    try {
      return await fetchFromNominatim(searchTerm, signal);
    } catch (fallbackError) {
      console.error(
        "Nominatim autocomplete também falhou:",
        fallbackError.message
      );
      toast.error("Erro ao buscar endereços", {
        description: "Ambos os serviços de geocoding falharam.",
      });
      return [];
    }
  }
}

export function useGeocodingAutocomplete() {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 350); // Atraso de 350ms
  const containerRef = useRef(null);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["autocomplete", debouncedSearchTerm],
    queryFn: fetchSuggestions,
    enabled: debouncedSearchTerm.length >= 3 && showSuggestions,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion, onSelect) => {
    setInputValue(suggestion.nome);
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e, onSelect) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0], onSelect);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    inputValue,
    suggestions,
    showSuggestions,
    isLoading,
    containerRef,
    handleInputChange,
    handleSuggestionClick,
    handleKeyDown,
    setInputValue,
    setShowSuggestions,
  };
}
