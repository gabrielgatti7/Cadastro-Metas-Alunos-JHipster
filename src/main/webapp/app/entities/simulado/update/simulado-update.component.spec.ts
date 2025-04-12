import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { SimuladoService } from '../service/simulado.service';
import { ISimulado } from '../simulado.model';
import { SimuladoFormService } from './simulado-form.service';

import { SimuladoUpdateComponent } from './simulado-update.component';

describe('Simulado Management Update Component', () => {
  let comp: SimuladoUpdateComponent;
  let fixture: ComponentFixture<SimuladoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let simuladoFormService: SimuladoFormService;
  let simuladoService: SimuladoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SimuladoUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SimuladoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SimuladoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    simuladoFormService = TestBed.inject(SimuladoFormService);
    simuladoService = TestBed.inject(SimuladoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const simulado: ISimulado = { id: 11574 };

      activatedRoute.data = of({ simulado });
      comp.ngOnInit();

      expect(comp.simulado).toEqual(simulado);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulado>>();
      const simulado = { id: 22678 };
      jest.spyOn(simuladoFormService, 'getSimulado').mockReturnValue(simulado);
      jest.spyOn(simuladoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulado }));
      saveSubject.complete();

      // THEN
      expect(simuladoFormService.getSimulado).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(simuladoService.update).toHaveBeenCalledWith(expect.objectContaining(simulado));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulado>>();
      const simulado = { id: 22678 };
      jest.spyOn(simuladoFormService, 'getSimulado').mockReturnValue({ id: null });
      jest.spyOn(simuladoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulado: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: simulado }));
      saveSubject.complete();

      // THEN
      expect(simuladoFormService.getSimulado).toHaveBeenCalled();
      expect(simuladoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISimulado>>();
      const simulado = { id: 22678 };
      jest.spyOn(simuladoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ simulado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(simuladoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
