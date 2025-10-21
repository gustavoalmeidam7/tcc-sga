import { useState, useEffect, useCallback } from "react";
import { MapaRota } from "../components/MapaRota";
import { useRotaCalculation } from "../hooks/useRotaCalculation";

const geoCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of geoCache.entries()) {
    if (now - val.time > CACHE_TTL) geoCache.delete(key);
  }
}, 15 * 60 * 1000);

const removerAcentos = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const STOP_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'a', 'o', 'para', 'por', 'com']);

// Extrai palavras-chave relevantes
function extrairPalavrasChave(endereco) {
  const normalizado = removerAcentos(endereco.toLowerCase());
  return normalizado
    .split(/[,\s\-]+/)
    .filter(p => p.length > 2)
    .filter(p => !STOP_WORDS.has(p))
    .filter(p => !/^\d+$/.test(p)); // Remove números
}

function calcularRelevancia(resultado, enderecoOriginal) {
  const displayName = removerAcentos(resultado.display_name.toLowerCase());
  const palavrasChave = extrairPalavrasChave(enderecoOriginal);
  let score = 0;

  let matches = 0;
  palavrasChave.forEach(palavra => {
    if (displayName.includes(palavra)) {
      matches++;
      score += 15;
    }
  });

  if (palavrasChave.length > 0) {
    score += (matches / palavrasChave.length) * 30;
  }

  const tipoScore = {
    'amenity': 30, 'building': 25, 'road': 20, 'residential': 15,
    'suburb': 8, 'city': -40, 'state': -60
  };
  score += tipoScore[resultado.type] || 0;

  score += (parseFloat(resultado.importance) || 0) * 15;

  const dist = Math.sqrt(
    Math.pow(parseFloat(resultado.lat) - (-22.0086), 2) +
    Math.pow(parseFloat(resultado.lon) - (-47.8908), 2)
  );
  if (dist > 0.15) score -= dist * 100;

  return score;
}

function extrairDetalhes(endereco) {
  const temSemNumero = /s\/n[ºo]?/i.test(endereco);
  const cepMatch = endereco.match(/\d{5}-?\d{3}/);
  const cep = cepMatch ? cepMatch[0] : null;

  let nomeEstabelecimento = null;
  const partes = endereco.split(',').map(p => p.trim());

  if (partes.length > 0) {
    const primeira = partes[0];

    const tiposEstabelecimento = /^(escola|hospital|clinica|cl[íi]nica|posto|centro|igreja|capela|shopping|mercado|supermercado|universidade|faculdade|instituto|farmacia|farm[aá]cia|laborat[óo]rio|hotel|pousada|restaurante|lanchonete|padaria|academia|gin[aá]sio|quadra|parque|pra[cç]a|terminal|esta[cç][aã]o|biblioteca|museu|teatro|cinema|banco|ag[eê]ncia|cart[óo]rio|f[óo]rum|delegacia|bombeiro|pronto.?socorro|upa|ubs|emei|emef|creche|col[eé]gio)/i;

    if (tiposEstabelecimento.test(primeira)) {
      nomeEstabelecimento = primeira;
    }
  }

  if (!nomeEstabelecimento && partes.length > 1) {
    const segunda = partes[1];
    if (/^(rua|r\.?|avenida|av\.?|travessa|trav\.?|alameda|al\.?|estrada|estr\.?|rodovia|rod\.?)/i.test(segunda)) {
      nomeEstabelecimento = partes[0];
    }
  }

  return { temSemNumero, cep, nomeEstabelecimento };
}

async function geocodificarEndereco(endereco) {
  const cacheKey = endereco.toLowerCase().trim();
  const cached = geoCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.coords;

  try {
    const bbox = "-47.9530,-22.0470,-47.8298,-21.9706";
    const centro = [-22.0086, -47.8908];
    const { temSemNumero, cep, nomeEstabelecimento } = extrairDetalhes(endereco);

    let norm = endereco
      .replace(/\s*-\s*/g, ', ')
      .replace(/s\/n[ºo]?/gi, '')
      .replace(/\d{5}-?\d{3}/g, '')
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .trim();

    if (!norm.toLowerCase().includes('são carlos')) norm += ', são carlos, sp';

    let resultados = [];
    const base = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&addressdetails=1`;

    if (nomeEstabelecimento) {
      const r = await fetch(`${base}&q=${encodeURIComponent(nomeEstabelecimento + ', são carlos, sp')}&limit=10&viewbox=${bbox}&bounded=1`);
      const d = await r.json();
      d.filter(x => x.type === 'amenity' || x.type === 'building').forEach(x => x.pri = 200);
      resultados.push(...d);
      if (d.length > 0 && d[0].type === 'amenity') {
        const coords = [parseFloat(d[0].lat), parseFloat(d[0].lon)];
        geoCache.set(cacheKey, { coords, time: Date.now() });
        return coords;
      }
    }

    if (temSemNumero && !nomeEstabelecimento) {
      const rua = norm.split(',')[0].trim();
      const palavras = extrairPalavrasChave(rua).slice(0, 3).join(' ');
      const r = await fetch(`${base}&q=${encodeURIComponent(`escola ${palavras} são carlos`)}&limit=10&viewbox=${bbox}&bounded=1`);
      const d = await r.json();
      d.filter(x => x.type === 'amenity').forEach(x => x.pri = 100);
      resultados.push(...d);
    }

    const r = await fetch(`${base}&q=${encodeURIComponent(norm)}&limit=10&viewbox=${bbox}&bounded=1`);
    resultados.push(...await r.json());

    if (resultados.length === 0) {
      geoCache.set(cacheKey, { coords: centro, time: Date.now() });
      return centro;
    }

    const vistos = new Set();
    const scored = resultados
      .filter(r => {
        const k = `${parseFloat(r.lat).toFixed(3)},${parseFloat(r.lon).toFixed(3)}`;
        if (vistos.has(k)) return false;
        vistos.add(k);
        return true;
      })
      .map(r => ({
        ...r,
        score: calcularRelevancia(r, endereco) +
               (r.pri || 0) +
               (r.display_name.toLowerCase().includes('são carlos') ? 30 : 0) +
               (temSemNumero && (r.type === 'amenity' || r.type === 'building') ? 50 : 0)
      }))
      .sort((a, b) => b.score - a.score);

    const coords = [parseFloat(scored[0].lat), parseFloat(scored[0].lon)];
    geoCache.set(cacheKey, { coords, time: Date.now() });
    return coords;

  } catch (err) {
    return [-22.0086, -47.8908];
  }
}

export function MapaDetalhes({ localInicio, localFim }) {
  const [coordOrigem, setCoordOrigem] = useState(null);
  const [coordDestino, setCoordDestino] = useState(null);
  const [rota, setRota] = useState([]);
  const [center, setCenter] = useState([-22.0086, -47.8908]);
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localInicio || !localFim) return;

    setLoading(true);
    Promise.all([
      geocodificarEndereco(localInicio),
      geocodificarEndereco(localFim)
    ]).then(([orig, dest]) => {
      setCoordOrigem(orig);
      setCoordDestino(dest);
    }).catch(() => setLoading(false));
  }, [localInicio, localFim]);

  const handleRotaCalculada = useCallback((resultado) => {
    if (resultado) setRota(resultado.coordinates);
    setLoading(false);
  }, []);

  useRotaCalculation(coordOrigem, coordDestino, handleRotaCalculada);

  useEffect(() => {
    if (coordOrigem && coordDestino) {
      const centerLat = (coordOrigem[0] + coordDestino[0]) / 2;
      const centerLng = (coordOrigem[1] + coordDestino[1]) / 2;
      setCenter([centerLat, centerLng]);
      setZoom(12);
    }
  }, [coordOrigem, coordDestino]);

  return (
    <MapaRota
      center={center}
      zoom={zoom}
      coordOrigem={coordOrigem}
      coordDestino={coordDestino}
      origem={localInicio}
      destino={localFim}
      rota={rota}
      loading={loading}
    />
  );
}
