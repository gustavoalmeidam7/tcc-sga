import { useState, useEffect, useRef } from "react";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

let fallbackToastShown = false;

async function fetchWithGeoapify(lat, lon, signal) {
  if (!GEOAPIFY_API_KEY) {
    throw new Error("GEOAPIFY_API_KEY não configurada");
  }

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}&lang=pt`,
    { signal }
  );

  if (response.status === 429) {
    throw new Error("Rate limit");
  }
  if (!response.ok) {
    throw new Error("Geoapify API failed");
  }

  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    throw new Error("No features found in Geoapify response");
  }

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
  if (props.name && props.name !== props.street) partes.push(props.name);
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
  if (estado && !valoresRegionais.includes(estado)) partes.push(estado);

  const partesUnicas = [
    ...new Set(partes.map((p) => p.toLowerCase().trim())),
  ].map((p, i) =>
    partes.find((original) => original.toLowerCase().trim() === p)
  );
  return (
    partesUnicas.slice(0, 5).join(", ") ||
    `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  );
}

async function fetchWithNominatim(lat, lon, signal) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR&zoom=18`,
    {
      signal,
      headers: { "User-Agent": "TCC-SGA-DriverApp/1.0" },
    }
  );

  if (!response.ok) {
    throw new Error("Nominatim API failed");
  }

  const data = await response.json();
  const addr = data.address || {};
  const partes = [];
  const nomeEstabelecimento = addr.amenity || addr.building || addr.name;
  if (nomeEstabelecimento && nomeEstabelecimento !== addr.road)
    partes.push(nomeEstabelecimento);
  if (addr.road) partes.push(addr.road);
  const bairro =
    addr.suburb || addr.neighbourhood || addr.district || addr.quarter;
  if (bairro) partes.push(bairro);
  if (addr.city || addr.town || addr.municipality)
    partes.push(addr.city || addr.town || addr.municipality);

  const partesUnicas = [
    ...new Set(partes.map((p) => p.toLowerCase().trim())),
  ].map((p, i) =>
    partes.find((original) => original.toLowerCase().trim() === p)
  );
  return (
    partesUnicas.slice(0, 4).join(", ") ||
    `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  );
}

export function useReverseGeocode(lat, lon, options = {}) {
  const { enabled = true } = options;
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !lat || !lon) {
      setEndereco(null);
      return;
    }

    const fetchEndereco = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        setLoading(true);
        setError(null);

        let resultado;
        try {
          resultado = await fetchWithGeoapify(lat, lon, signal);
        } catch (err) {
          console.warn(
            "Geoapify falhou, tentando Nominatim. Erro:",
            err.message
          );
          resultado = await fetchWithNominatim(lat, lon, signal);
        }

        if (!signal.aborted) {
          setEndereco(resultado);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !signal.aborted) {
          console.error("Erro ao fazer reverse geocoding:", err);
          setError(err.message);
          setEndereco(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEndereco();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [lat, lon, enabled]);

  return { endereco, loading, error };
}
