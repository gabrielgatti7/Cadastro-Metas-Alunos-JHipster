import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISimulado } from '../simulado.model';
import { SimuladoService } from '../service/simulado.service';

const simuladoResolve = (route: ActivatedRouteSnapshot): Observable<null | ISimulado> => {
  const id = route.params.id;
  if (id) {
    return inject(SimuladoService)
      .find(id)
      .pipe(
        mergeMap((simulado: HttpResponse<ISimulado>) => {
          if (simulado.body) {
            return of(simulado.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default simuladoResolve;
