import { useState, useRef, useEffect } from "react";

export function useGeocodingAutocomplete() {
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);

  const formatarEndereco = (displayName) => {
    const partes = displayName.split(', ');

    const relevantes = partes.filter(parte =>
      !parte.includes('Região') &&
      !parte.includes('Brasil') &&
      !parte.includes('Brazil') &&
      !/^\d{5}-\d{3}$/.test(parte)
    );

    return relevantes.slice(0, 4).join(', ');
  };

  const buscarSugestoes = async (texto) => {
    if (texto.length < 3) {
      setSugestoes([]);
      return;
    }

    try {
      const saoCarlosBbox = "-47.9530,-22.0470,-47.8298,-21.9706";

      const responseSaoCarlos = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          texto + ", São Carlos, SP"
        )}&limit=5&countrycodes=br&viewbox=${saoCarlosBbox}&bounded=1&addressdetails=1`
      );
      const dataSaoCarlos = await responseSaoCarlos.json();

      const responseBrasil = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          texto
        )}&limit=5&countrycodes=br&addressdetails=1`
      );
      const dataBrasil = await responseBrasil.json();

      const todosDados = [...dataSaoCarlos, ...dataBrasil];

      const dadosUnicos = todosDados.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.lat === item.lat && t.lon === item.lon
        ))
      );

      const sugestoesBrasil = dadosUnicos
        .slice(0, 10)
        .map((item) => ({
          nome: formatarEndereco(item.display_name),
          nomeCompleto: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));

      setSugestoes(sugestoesBrasil);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
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

  return {
    sugestoes,
    showSugestoes,
    inputRef,
    handleInputChange,
    handleKeyDown,
    handleSugestaoClick,
    setShowSugestoes,
  };
}
