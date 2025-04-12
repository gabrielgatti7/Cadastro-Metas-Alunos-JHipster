import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INota } from '../nota.model';
import { NotaService } from '../service/nota.service';

const notaResolve = (route: ActivatedRouteSnapshot): Observable<null | INota> => {
  const id = route.params.id;
  if (id) {
    return inject(NotaService)
      .find(id)
      .pipe(
        mergeMap((nota: HttpResponse<INota>) => {
          if (nota.body) {
            return of(nota.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default notaResolve;
