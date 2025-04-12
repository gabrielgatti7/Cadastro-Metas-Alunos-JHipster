import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ISimulado } from '../simulado.model';

@Component({
  selector: 'jhi-simulado-detail',
  templateUrl: './simulado-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class SimuladoDetailComponent {
  simulado = input<ISimulado | null>(null);

  previousState(): void {
    window.history.back();
  }
}
