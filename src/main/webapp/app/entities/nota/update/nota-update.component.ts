import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { ISimulado } from 'app/entities/simulado/simulado.model';
import { SimuladoService } from 'app/entities/simulado/service/simulado.service';
import { AreaDoEnem } from 'app/entities/enumerations/area-do-enem.model';
import { NotaService } from '../service/nota.service';
import { INota } from '../nota.model';
import { NotaFormGroup, NotaFormService } from './nota-form.service';

@Component({
  selector: 'jhi-nota-update',
  templateUrl: './nota-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NotaUpdateComponent implements OnInit {
  isSaving = false;
  nota: INota | null = null;
  areaDoEnemValues = Object.keys(AreaDoEnem);

  alunosSharedCollection: IAluno[] = [];
  simuladosSharedCollection: ISimulado[] = [];

  protected notaService = inject(NotaService);
  protected notaFormService = inject(NotaFormService);
  protected alunoService = inject(AlunoService);
  protected simuladoService = inject(SimuladoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: NotaFormGroup = this.notaFormService.createNotaFormGroup();

  compareAluno = (o1: IAluno | null, o2: IAluno | null): boolean => this.alunoService.compareAluno(o1, o2);

  compareSimulado = (o1: ISimulado | null, o2: ISimulado | null): boolean => this.simuladoService.compareSimulado(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nota }) => {
      this.nota = nota;
      if (nota) {
        this.updateForm(nota);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nota = this.notaFormService.getNota(this.editForm);
    if (nota.id !== null) {
      this.subscribeToSaveResponse(this.notaService.update(nota));
    } else {
      this.subscribeToSaveResponse(this.notaService.create(nota));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INota>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(nota: INota): void {
    this.nota = nota;
    this.notaFormService.resetForm(this.editForm, nota);

    this.alunosSharedCollection = this.alunoService.addAlunoToCollectionIfMissing<IAluno>(this.alunosSharedCollection, nota.aluno);
    this.simuladosSharedCollection = this.simuladoService.addSimuladoToCollectionIfMissing<ISimulado>(
      this.simuladosSharedCollection,
      nota.simulado,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.alunoService
      .query()
      .pipe(map((res: HttpResponse<IAluno[]>) => res.body ?? []))
      .pipe(map((alunos: IAluno[]) => this.alunoService.addAlunoToCollectionIfMissing<IAluno>(alunos, this.nota?.aluno)))
      .subscribe((alunos: IAluno[]) => (this.alunosSharedCollection = alunos));

    this.simuladoService
      .query()
      .pipe(map((res: HttpResponse<ISimulado[]>) => res.body ?? []))
      .pipe(
        map((simulados: ISimulado[]) => this.simuladoService.addSimuladoToCollectionIfMissing<ISimulado>(simulados, this.nota?.simulado)),
      )
      .subscribe((simulados: ISimulado[]) => (this.simuladosSharedCollection = simulados));
  }
}
