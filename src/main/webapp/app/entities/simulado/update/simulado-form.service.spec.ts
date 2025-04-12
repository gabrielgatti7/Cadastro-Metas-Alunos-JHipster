import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../simulado.test-samples';

import { SimuladoFormService } from './simulado-form.service';

describe('Simulado Form Service', () => {
  let service: SimuladoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimuladoFormService);
  });

  describe('Service methods', () => {
    describe('createSimuladoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSimuladoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing ISimulado should create a new form with FormGroup', () => {
        const formGroup = service.createSimuladoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getSimulado', () => {
      it('should return NewSimulado for default Simulado initial value', () => {
        const formGroup = service.createSimuladoFormGroup(sampleWithNewData);

        const simulado = service.getSimulado(formGroup) as any;

        expect(simulado).toMatchObject(sampleWithNewData);
      });

      it('should return NewSimulado for empty Simulado initial value', () => {
        const formGroup = service.createSimuladoFormGroup();

        const simulado = service.getSimulado(formGroup) as any;

        expect(simulado).toMatchObject({});
      });

      it('should return ISimulado', () => {
        const formGroup = service.createSimuladoFormGroup(sampleWithRequiredData);

        const simulado = service.getSimulado(formGroup) as any;

        expect(simulado).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISimulado should not enable id FormControl', () => {
        const formGroup = service.createSimuladoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSimulado should disable id FormControl', () => {
        const formGroup = service.createSimuladoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
