import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISimulado } from '../simulado.model';
import { SimuladoService } from '../service/simulado.service';

@Component({
  templateUrl: './simulado-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SimuladoDeleteDialogComponent {
  simulado?: ISimulado;

  protected simuladoService = inject(SimuladoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.simuladoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
