import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMeta } from '../meta.model';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

@Component({
  selector: 'jhi-meta-detail',
  templateUrl: './meta-detail.component.html',
  imports: [SharedModule, RouterModule, HasAnyAuthorityDirective],
})
export class MetaDetailComponent {
  meta = input<IMeta | null>(null);

  previousState(): void {
    window.history.back();
  }
}
