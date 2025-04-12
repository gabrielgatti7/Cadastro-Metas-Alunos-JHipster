import { INota, NewNota } from './nota.model';

export const sampleWithRequiredData: INota = {
  id: 30140,
  valor: 684,
  area: 'NATUREZA',
};

export const sampleWithPartialData: INota = {
  id: 25008,
  valor: 337,
  area: 'HUMANAS',
};

export const sampleWithFullData: INota = {
  id: 18929,
  valor: 1518,
  area: 'NATUREZA',
};

export const sampleWithNewData: NewNota = {
  valor: 1248,
  area: 'MATEMATICA',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
