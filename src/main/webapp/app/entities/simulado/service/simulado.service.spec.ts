import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ISimulado } from '../simulado.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../simulado.test-samples';

import { SimuladoService } from './simulado.service';

const requireRestSample: ISimulado = {
  ...sampleWithRequiredData,
};

describe('Simulado Service', () => {
  let service: SimuladoService;
  let httpMock: HttpTestingController;
  let expectedResult: ISimulado | ISimulado[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SimuladoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Simulado', () => {
      const simulado = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(simulado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Simulado', () => {
      const simulado = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(simulado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Simulado', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Simulado', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Simulado', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSimuladoToCollectionIfMissing', () => {
      it('should add a Simulado to an empty array', () => {
        const simulado: ISimulado = sampleWithRequiredData;
        expectedResult = service.addSimuladoToCollectionIfMissing([], simulado);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulado);
      });

      it('should not add a Simulado to an array that contains it', () => {
        const simulado: ISimulado = sampleWithRequiredData;
        const simuladoCollection: ISimulado[] = [
          {
            ...simulado,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSimuladoToCollectionIfMissing(simuladoCollection, simulado);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Simulado to an array that doesn't contain it", () => {
        const simulado: ISimulado = sampleWithRequiredData;
        const simuladoCollection: ISimulado[] = [sampleWithPartialData];
        expectedResult = service.addSimuladoToCollectionIfMissing(simuladoCollection, simulado);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulado);
      });

      it('should add only unique Simulado to an array', () => {
        const simuladoArray: ISimulado[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const simuladoCollection: ISimulado[] = [sampleWithRequiredData];
        expectedResult = service.addSimuladoToCollectionIfMissing(simuladoCollection, ...simuladoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const simulado: ISimulado = sampleWithRequiredData;
        const simulado2: ISimulado = sampleWithPartialData;
        expectedResult = service.addSimuladoToCollectionIfMissing([], simulado, simulado2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(simulado);
        expect(expectedResult).toContain(simulado2);
      });

      it('should accept null and undefined values', () => {
        const simulado: ISimulado = sampleWithRequiredData;
        expectedResult = service.addSimuladoToCollectionIfMissing([], null, simulado, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(simulado);
      });

      it('should return initial array if no Simulado is added', () => {
        const simuladoCollection: ISimulado[] = [sampleWithRequiredData];
        expectedResult = service.addSimuladoToCollectionIfMissing(simuladoCollection, undefined, null);
        expect(expectedResult).toEqual(simuladoCollection);
      });
    });

    describe('compareSimulado', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSimulado(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 22678 };
        const entity2 = null;

        const compareResult1 = service.compareSimulado(entity1, entity2);
        const compareResult2 = service.compareSimulado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 22678 };
        const entity2 = { id: 11574 };

        const compareResult1 = service.compareSimulado(entity1, entity2);
        const compareResult2 = service.compareSimulado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 22678 };
        const entity2 = { id: 22678 };

        const compareResult1 = service.compareSimulado(entity1, entity2);
        const compareResult2 = service.compareSimulado(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
