import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { ISimulado } from 'app/entities/simulado/simulado.model';
import { SimuladoService } from 'app/entities/simulado/service/simulado.service';
import { INota } from '../nota.model';
import { NotaService } from '../service/nota.service';
import { NotaFormService } from './nota-form.service';

import { NotaUpdateComponent } from './nota-update.component';

describe('Nota Management Update Component', () => {
  let comp: NotaUpdateComponent;
  let fixture: ComponentFixture<NotaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notaFormService: NotaFormService;
  let notaService: NotaService;
  let alunoService: AlunoService;
  let simuladoService: SimuladoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotaUpdateComponent],
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
      .overrideTemplate(NotaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notaFormService = TestBed.inject(NotaFormService);
    notaService = TestBed.inject(NotaService);
    alunoService = TestBed.inject(AlunoService);
    simuladoService = TestBed.inject(SimuladoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Aluno query and add missing value', () => {
      const nota: INota = { id: 28868 };
      const aluno: IAluno = { id: 15328 };
      nota.aluno = aluno;

      const alunoCollection: IAluno[] = [{ id: 15328 }];
      jest.spyOn(alunoService, 'query').mockReturnValue(of(new HttpResponse({ body: alunoCollection })));
      const additionalAlunos = [aluno];
      const expectedCollection: IAluno[] = [...additionalAlunos, ...alunoCollection];
      jest.spyOn(alunoService, 'addAlunoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ nota });
      comp.ngOnInit();

      expect(alunoService.query).toHaveBeenCalled();
      expect(alunoService.addAlunoToCollectionIfMissing).toHaveBeenCalledWith(
        alunoCollection,
        ...additionalAlunos.map(expect.objectContaining),
      );
      expect(comp.alunosSharedCollection).toEqual(expectedCollection);
    });

    it('should call Simulado query and add missing value', () => {
      const nota: INota = { id: 28868 };
      const simulado: ISimulado = { id: 22678 };
      nota.simulado = simulado;

      const simuladoCollection: ISimulado[] = [{ id: 22678 }];
      jest.spyOn(simuladoService, 'query').mockReturnValue(of(new HttpResponse({ body: simuladoCollection })));
      const additionalSimulados = [simulado];
      const expectedCollection: ISimulado[] = [...additionalSimulados, ...simuladoCollection];
      jest.spyOn(simuladoService, 'addSimuladoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ nota });
      comp.ngOnInit();

      expect(simuladoService.query).toHaveBeenCalled();
      expect(simuladoService.addSimuladoToCollectionIfMissing).toHaveBeenCalledWith(
        simuladoCollection,
        ...additionalSimulados.map(expect.objectContaining),
      );
      expect(comp.simuladosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const nota: INota = { id: 28868 };
      const aluno: IAluno = { id: 15328 };
      nota.aluno = aluno;
      const simulado: ISimulado = { id: 22678 };
      nota.simulado = simulado;

      activatedRoute.data = of({ nota });
      comp.ngOnInit();

      expect(comp.alunosSharedCollection).toContainEqual(aluno);
      expect(comp.simuladosSharedCollection).toContainEqual(simulado);
      expect(comp.nota).toEqual(nota);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INota>>();
      const nota = { id: 21411 };
      jest.spyOn(notaFormService, 'getNota').mockReturnValue(nota);
      jest.spyOn(notaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nota });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nota }));
      saveSubject.complete();

      // THEN
      expect(notaFormService.getNota).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(notaService.update).toHaveBeenCalledWith(expect.objectContaining(nota));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INota>>();
      const nota = { id: 21411 };
      jest.spyOn(notaFormService, 'getNota').mockReturnValue({ id: null });
      jest.spyOn(notaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nota: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nota }));
      saveSubject.complete();

      // THEN
      expect(notaFormService.getNota).toHaveBeenCalled();
      expect(notaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INota>>();
      const nota = { id: 21411 };
      jest.spyOn(notaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nota });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAluno', () => {
      it('should forward to alunoService', () => {
        const entity = { id: 15328 };
        const entity2 = { id: 9303 };
        jest.spyOn(alunoService, 'compareAluno');
        comp.compareAluno(entity, entity2);
        expect(alunoService.compareAluno).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSimulado', () => {
      it('should forward to simuladoService', () => {
        const entity = { id: 22678 };
        const entity2 = { id: 11574 };
        jest.spyOn(simuladoService, 'compareSimulado');
        comp.compareSimulado(entity, entity2);
        expect(simuladoService.compareSimulado).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
