import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { INota } from '../nota.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../nota.test-samples';

import { NotaService } from './nota.service';

const requireRestSample: INota = {
  ...sampleWithRequiredData,
};

describe('Nota Service', () => {
  let service: NotaService;
  let httpMock: HttpTestingController;
  let expectedResult: INota | INota[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(NotaService);
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

    it('should create a Nota', () => {
      const nota = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(nota).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Nota', () => {
      const nota = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(nota).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Nota', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Nota', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Nota', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNotaToCollectionIfMissing', () => {
      it('should add a Nota to an empty array', () => {
        const nota: INota = sampleWithRequiredData;
        expectedResult = service.addNotaToCollectionIfMissing([], nota);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nota);
      });

      it('should not add a Nota to an array that contains it', () => {
        const nota: INota = sampleWithRequiredData;
        const notaCollection: INota[] = [
          {
            ...nota,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, nota);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Nota to an array that doesn't contain it", () => {
        const nota: INota = sampleWithRequiredData;
        const notaCollection: INota[] = [sampleWithPartialData];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, nota);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nota);
      });

      it('should add only unique Nota to an array', () => {
        const notaArray: INota[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const notaCollection: INota[] = [sampleWithRequiredData];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, ...notaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nota: INota = sampleWithRequiredData;
        const nota2: INota = sampleWithPartialData;
        expectedResult = service.addNotaToCollectionIfMissing([], nota, nota2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nota);
        expect(expectedResult).toContain(nota2);
      });

      it('should accept null and undefined values', () => {
        const nota: INota = sampleWithRequiredData;
        expectedResult = service.addNotaToCollectionIfMissing([], null, nota, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nota);
      });

      it('should return initial array if no Nota is added', () => {
        const notaCollection: INota[] = [sampleWithRequiredData];
        expectedResult = service.addNotaToCollectionIfMissing(notaCollection, undefined, null);
        expect(expectedResult).toEqual(notaCollection);
      });
    });

    describe('compareNota', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNota(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 21411 };
        const entity2 = null;

        const compareResult1 = service.compareNota(entity1, entity2);
        const compareResult2 = service.compareNota(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 21411 };
        const entity2 = { id: 28868 };

        const compareResult1 = service.compareNota(entity1, entity2);
        const compareResult2 = service.compareNota(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 21411 };
        const entity2 = { id: 21411 };

        const compareResult1 = service.compareNota(entity1, entity2);
        const compareResult2 = service.compareNota(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
