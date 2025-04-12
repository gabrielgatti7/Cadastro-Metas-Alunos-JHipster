export interface ISimulado {
  id: number;
  nome?: string | null;
}

export type NewSimulado = Omit<ISimulado, 'id'> & { id: null };
