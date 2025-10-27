import { useState, useEffect, useCallback } from "react";
import { MapaRota } from "@/pages/Viagens/components/MapaRota";
import { useRotaCalculation } from "@/pages/Viagens/hooks/useRotaCalculation";
import { reverseGeocode } from "@/hooks/useReverseGeocode";

export function MapaDetalhes({
  lat_inicio,
  long_inicio,
  lat_fim,
  long_fim,
  onEnderecosCarregados,
}) {
  const [coordOrigem, setCoordOrigem] = useState(null);
  const [coordDestino, setCoordDestino] = useState(null);
  const [rota, setRota] = useState([]);
  const [center, setCenter] = useState([-22.0086, -47.8908]);
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat_inicio || !long_inicio || !lat_fim || !long_fim) return;

    const coords = [lat_inicio, long_inicio];
    const coordsDest = [lat_fim, long_fim];

    setCoordOrigem(coords);
    setCoordDestino(coordsDest);

    if (onEnderecosCarregados) {
      Promise.all([
        reverseGeocode(lat_inicio, long_inicio),
        reverseGeocode(lat_fim, long_fim),
      ]).then(([enderecoOrigem, enderecoDestino]) => {
        onEnderecosCarregados({
          origem: enderecoOrigem,
          destino: enderecoDestino,
        });
      });
    }
  }, [lat_inicio, long_inicio, lat_fim, long_fim, onEnderecosCarregados]);

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
      origem={`Lat: ${lat_inicio?.toFixed(6)}, Long: ${long_inicio?.toFixed(
        6
      )}`}
      destino={`Lat: ${lat_fim?.toFixed(6)}, Long: ${long_fim?.toFixed(6)}`}
      rota={rota}
      loading={loading}
    />
  );
}
