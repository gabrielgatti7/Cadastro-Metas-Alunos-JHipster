import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { INota, NewNota } from '../nota.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INota for edit and NewNotaFormGroupInput for create.
 */
type NotaFormGroupInput = INota | PartialWithRequiredKeyOf<NewNota>;

type NotaFormDefaults = Pick<NewNota, 'id'>;

type NotaFormGroupContent = {
  id: FormControl<INota['id'] | NewNota['id']>;
  valor: FormControl<INota['valor']>;
  area: FormControl<INota['area']>;
  aluno: FormControl<INota['aluno']>;
  simulado: FormControl<INota['simulado']>;
};

export type NotaFormGroup = FormGroup<NotaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotaFormService {
  createNotaFormGroup(nota: NotaFormGroupInput = { id: null }): NotaFormGroup {
    const notaRawValue = {
      ...this.getFormDefaults(),
      ...nota,
    };
    return new FormGroup<NotaFormGroupContent>({
      id: new FormControl(
        { value: notaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      valor: new FormControl(notaRawValue.valor, {
        validators: [Validators.required, Validators.min(0), Validators.max(2000)],
      }),
      area: new FormControl(notaRawValue.area, {
        validators: [Validators.required],
      }),
      aluno: new FormControl(notaRawValue.aluno, {
        validators: [Validators.required],
      }),
      simulado: new FormControl(notaRawValue.simulado, {
        validators: [Validators.required],
      }),
    });
  }

  getNota(form: NotaFormGroup): INota | NewNota {
    return form.getRawValue() as INota | NewNota;
  }

  resetForm(form: NotaFormGroup, nota: NotaFormGroupInput): void {
    const notaRawValue = { ...this.getFormDefaults(), ...nota };
    form.reset(
      {
        ...notaRawValue,
        id: { value: notaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NotaFormDefaults {
    return {
      id: null,
    };
  }
}
