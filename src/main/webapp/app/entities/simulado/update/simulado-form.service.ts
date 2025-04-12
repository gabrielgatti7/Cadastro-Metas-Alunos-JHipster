import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISimulado, NewSimulado } from '../simulado.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISimulado for edit and NewSimuladoFormGroupInput for create.
 */
type SimuladoFormGroupInput = ISimulado | PartialWithRequiredKeyOf<NewSimulado>;

type SimuladoFormDefaults = Pick<NewSimulado, 'id'>;

type SimuladoFormGroupContent = {
  id: FormControl<ISimulado['id'] | NewSimulado['id']>;
  nome: FormControl<ISimulado['nome']>;
};

export type SimuladoFormGroup = FormGroup<SimuladoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SimuladoFormService {
  createSimuladoFormGroup(simulado: SimuladoFormGroupInput = { id: null }): SimuladoFormGroup {
    const simuladoRawValue = {
      ...this.getFormDefaults(),
      ...simulado,
    };
    return new FormGroup<SimuladoFormGroupContent>({
      id: new FormControl(
        { value: simuladoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(simuladoRawValue.nome, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    });
  }

  getSimulado(form: SimuladoFormGroup): ISimulado | NewSimulado {
    return form.getRawValue() as ISimulado | NewSimulado;
  }

  resetForm(form: SimuladoFormGroup, simulado: SimuladoFormGroupInput): void {
    const simuladoRawValue = { ...this.getFormDefaults(), ...simulado };
    form.reset(
      {
        ...simuladoRawValue,
        id: { value: simuladoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SimuladoFormDefaults {
    return {
      id: null,
    };
  }
}
