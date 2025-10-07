import { useState } from "react";

export function useViagem() {
  const [telaAtual, setTelaAtual] = useState(1);
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [coordOrigem, setCoordOrigem] = useState(null);
  const [coordDestino, setCoordDestino] = useState(null);
  const [rota, setRota] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [center, setCenter] = useState([-22.0088, -47.8914]);
  const [zoom, setZoom] = useState(13);
  const [distancia, setDistancia] = useState(null);
  const [duracao, setDuracao] = useState(null);

  const [nomePaciente, setNomePaciente] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState("");
  const [estadoSaude, setEstadoSaude] = useState("andando");
  const [observacoes, setObservacoes] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");

  const resetarFormulario = () => {
    setTelaAtual(1);
    setOrigem("");
    setDestino("");
    setCoordOrigem(null);
    setCoordDestino(null);
    setRota([]);
    setNomePaciente("");
    setCpfPaciente("");
    setEstadoSaude("andando");
    setObservacoes("");
    setDataAgendamento("");
    setHoraAgendamento("");
    setCenter([-22.0088, -47.8914]);
    setZoom(13);
    setDistancia(null);
    setDuracao(null);
    setError("");
  };

  return {
    telaAtual,
    origem,
    destino,
    coordOrigem,
    coordDestino,
    rota,
    loading,
    error,
    center,
    zoom,
    distancia,
    duracao,
    nomePaciente,
    cpfPaciente,
    estadoSaude,
    observacoes,
    dataAgendamento,
    horaAgendamento,
    setTelaAtual,
    setOrigem,
    setDestino,
    setCoordOrigem,
    setCoordDestino,
    setRota,
    setLoading,
    setError,
    setCenter,
    setZoom,
    setDistancia,
    setDuracao,
    setNomePaciente,
    setCpfPaciente,
    setEstadoSaude,
    setObservacoes,
    setDataAgendamento,
    setHoraAgendamento,
    resetarFormulario,
  };
}
