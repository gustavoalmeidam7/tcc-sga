import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

let fallbackToastShown = false;

async function fetchWithGeoapify(lat, lon, signal) {
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
  if (!fallbackToastShown) {
    toast.info("Usando servidor de mapas alternativo.", {
      description: "Endereços sendo carregados normalmente.",
      duration: 5000,
    });
    fallbackToastShown = true;
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=pt-BR&zoom=18`,
    {
      signal,
      headers: { "User-Agent": "TCC-SGA-Frontend/1.0" },
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

export async function fetchReverseGeocode({ queryKey, signal }) {
  const [_key, lat, lon] = queryKey;

  const isAborted = (error) =>
    error.name === "AbortError" ||
    error.message?.includes("aborted") ||
    error.message?.includes("signal is aborted");

  try {
    return await fetchWithGeoapify(lat, lon, signal);
  } catch (error) {
    if (isAborted(error)) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }

    console.warn("Geoapify falhou, tentando Nominatim. Erro:", error.message);
    try {
      return await fetchWithNominatim(lat, lon, signal);
    } catch (fallbackError) {
      if (isAborted(fallbackError)) {
        return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }

      console.error("Nominatim também falhou:", fallbackError.message);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }
}

export function useReverseGeocodeQuery(lat, lon, options = {}) {
  const { enabled = true, ...restOptions } = options;

  return useQuery({
    queryKey: ["geocode", lat, lon],
    queryFn: fetchReverseGeocode,
    enabled: enabled && !!lat && !!lon,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: false,
    ...restOptions,
  });
}
