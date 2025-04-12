import { IMeta, NewMeta } from './meta.model';

export const sampleWithRequiredData: IMeta = {
  id: 17187,
  valor: 700,
  area: 'HUMANAS',
};

export const sampleWithPartialData: IMeta = {
  id: 15622,
  valor: 1483,
  area: 'HUMANAS',
};

export const sampleWithFullData: IMeta = {
  id: 32703,
  valor: 352,
  area: 'LINGUAGENS',
};

export const sampleWithNewData: NewMeta = {
  valor: 993,
  area: 'MATEMATICA',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
