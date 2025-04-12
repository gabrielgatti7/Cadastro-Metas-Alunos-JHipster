import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../nota.test-samples';

import { NotaFormService } from './nota-form.service';

describe('Nota Form Service', () => {
  let service: NotaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaFormService);
  });

  describe('Service methods', () => {
    describe('createNotaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNotaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            area: expect.any(Object),
            aluno: expect.any(Object),
            simulado: expect.any(Object),
          }),
        );
      });

      it('passing INota should create a new form with FormGroup', () => {
        const formGroup = service.createNotaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            area: expect.any(Object),
            aluno: expect.any(Object),
            simulado: expect.any(Object),
          }),
        );
      });
    });

    describe('getNota', () => {
      it('should return NewNota for default Nota initial value', () => {
        const formGroup = service.createNotaFormGroup(sampleWithNewData);

        const nota = service.getNota(formGroup) as any;

        expect(nota).toMatchObject(sampleWithNewData);
      });

      it('should return NewNota for empty Nota initial value', () => {
        const formGroup = service.createNotaFormGroup();

        const nota = service.getNota(formGroup) as any;

        expect(nota).toMatchObject({});
      });

      it('should return INota', () => {
        const formGroup = service.createNotaFormGroup(sampleWithRequiredData);

        const nota = service.getNota(formGroup) as any;

        expect(nota).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INota should not enable id FormControl', () => {
        const formGroup = service.createNotaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNota should disable id FormControl', () => {
        const formGroup = service.createNotaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
