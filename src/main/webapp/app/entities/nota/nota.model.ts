import { IAluno } from 'app/entities/aluno/aluno.model';
import { ISimulado } from 'app/entities/simulado/simulado.model';
import { AreaDoEnem } from 'app/entities/enumerations/area-do-enem.model';

export interface INota {
  id: number;
  valor?: number | null;
  area?: keyof typeof AreaDoEnem | null;
  aluno?: IAluno | null;
  simulado?: ISimulado | null;
}

export type NewNota = Omit<INota, 'id'> & { id: null };
