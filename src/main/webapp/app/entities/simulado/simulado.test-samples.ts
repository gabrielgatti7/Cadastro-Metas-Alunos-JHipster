import { ISimulado, NewSimulado } from './simulado.model';

export const sampleWithRequiredData: ISimulado = {
  id: 17376,
  nome: 'now stable burdensome',
};

export const sampleWithPartialData: ISimulado = {
  id: 1073,
  nome: 'unsightly metallic behind',
};

export const sampleWithFullData: ISimulado = {
  id: 3246,
  nome: 'anti round',
};

export const sampleWithNewData: NewSimulado = {
  nome: 'happily',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
