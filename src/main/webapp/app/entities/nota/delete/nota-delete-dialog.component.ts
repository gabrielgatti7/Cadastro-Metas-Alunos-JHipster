import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { INota } from '../nota.model';
import { NotaService } from '../service/nota.service';

@Component({
  templateUrl: './nota-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class NotaDeleteDialogComponent {
  nota?: INota;

  protected notaService = inject(NotaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
