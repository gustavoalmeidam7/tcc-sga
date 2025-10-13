import { useReducer } from "react";

const initialState = {
  telaAtual: 1,
  origem: "",
  destino: "",
  coordOrigem: null,
  coordDestino: null,
  rota: [],
  loading: false,
  error: "",
  center: [-22.0088, -47.8914],
  zoom: 13,
  distancia: null,
  duracao: null,
  nomePaciente: "",
  cpfPaciente: "",
  estadoSaude: "andando",
  observacoes: "",
  dataAgendamento: "",
  horaAgendamento: "",
};

function viagemReducer(state, action) {
  switch (action.type) {
    case "SET_TELA_ATUAL":
      return { ...state, telaAtual: action.payload };

    case "SET_ORIGEM":
      return { ...state, origem: action.payload };

    case "SET_DESTINO":
      return { ...state, destino: action.payload };

    case "SET_COORD_ORIGEM":
      return { ...state, coordOrigem: action.payload };

    case "SET_COORD_DESTINO":
      return { ...state, coordDestino: action.payload };

    case "SET_ROTA":
      return { ...state, rota: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_CENTER":
      return { ...state, center: action.payload };

    case "SET_ZOOM":
      return { ...state, zoom: action.payload };

    case "SET_DISTANCIA":
      return { ...state, distancia: action.payload };

    case "SET_DURACAO":
      return { ...state, duracao: action.payload };

    case "SET_NOME_PACIENTE":
      return { ...state, nomePaciente: action.payload };

    case "SET_CPF_PACIENTE":
      return { ...state, cpfPaciente: action.payload };

    case "SET_ESTADO_SAUDE":
      return { ...state, estadoSaude: action.payload };

    case "SET_OBSERVACOES":
      return { ...state, observacoes: action.payload };

    case "SET_DATA_AGENDAMENTO":
      return { ...state, dataAgendamento: action.payload };

    case "SET_HORA_AGENDAMENTO":
      return { ...state, horaAgendamento: action.payload };

    case "SET_ROTA_COMPLETA":
      return {
        ...state,
        rota: action.payload.rota,
        distancia: action.payload.distancia,
        duracao: action.payload.duracao,
        center: action.payload.center,
        zoom: action.payload.zoom,
        loading: false,
      };

    case "RESET_FORMULARIO":
      return initialState;

    default:
      return state;
  }
}

export function useViagem() {
  const [state, dispatch] = useReducer(viagemReducer, initialState);

  const setTelaAtual = (valor) => dispatch({ type: "SET_TELA_ATUAL", payload: valor });
  const setOrigem = (valor) => dispatch({ type: "SET_ORIGEM", payload: valor });
  const setDestino = (valor) => dispatch({ type: "SET_DESTINO", payload: valor });
  const setCoordOrigem = (valor) => dispatch({ type: "SET_COORD_ORIGEM", payload: valor });
  const setCoordDestino = (valor) => dispatch({ type: "SET_COORD_DESTINO", payload: valor });
  const setRota = (valor) => dispatch({ type: "SET_ROTA", payload: valor });
  const setLoading = (valor) => dispatch({ type: "SET_LOADING", payload: valor });
  const setError = (valor) => dispatch({ type: "SET_ERROR", payload: valor });
  const setCenter = (valor) => dispatch({ type: "SET_CENTER", payload: valor });
  const setZoom = (valor) => dispatch({ type: "SET_ZOOM", payload: valor });
  const setDistancia = (valor) => dispatch({ type: "SET_DISTANCIA", payload: valor });
  const setDuracao = (valor) => dispatch({ type: "SET_DURACAO", payload: valor });
  const setNomePaciente = (valor) => dispatch({ type: "SET_NOME_PACIENTE", payload: valor });
  const setCpfPaciente = (valor) => dispatch({ type: "SET_CPF_PACIENTE", payload: valor });
  const setEstadoSaude = (valor) => dispatch({ type: "SET_ESTADO_SAUDE", payload: valor });
  const setObservacoes = (valor) => dispatch({ type: "SET_OBSERVACOES", payload: valor });
  const setDataAgendamento = (valor) => dispatch({ type: "SET_DATA_AGENDAMENTO", payload: valor });
  const setHoraAgendamento = (valor) => dispatch({ type: "SET_HORA_AGENDAMENTO", payload: valor });

  const setRotaCompleta = (dados) => dispatch({ type: "SET_ROTA_COMPLETA", payload: dados });

  const resetarFormulario = () => dispatch({ type: "RESET_FORMULARIO" });

  return {
    ...state,
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
    setRotaCompleta,
    resetarFormulario,
  };
}
