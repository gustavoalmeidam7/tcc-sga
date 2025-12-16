export interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  telefone?: string;
}

export interface Travel {
  id: number;
  id_paciente: number;
  id_motorista: number;
  end_inicio: string;
  end_fim: string;
  inicio: string;
  realizado: 0 | 1 | 2;
  distancia?: string;
  tempo_estimado?: string;
  observacoes?: string;
  [key: string]: any;
}
