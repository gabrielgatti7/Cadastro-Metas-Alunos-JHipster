import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { INota } from '../nota.model';

@Component({
  selector: 'jhi-nota-detail',
  templateUrl: './nota-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class NotaDetailComponent {
  nota = input<INota | null>(null);

  previousState(): void {
    window.history.back();
  }
}
