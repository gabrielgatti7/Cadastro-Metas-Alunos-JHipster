import { IUser } from 'app/entities/user/user.model';

export interface IAluno {
  id: number;
  nome?: string | null;
  email?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewAluno = Omit<IAluno, 'id'> & { id: null };
