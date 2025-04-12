import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SimuladoResolve from './route/simulado-routing-resolve.service';

const simuladoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/simulado.component').then(m => m.SimuladoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/simulado-detail.component').then(m => m.SimuladoDetailComponent),
    resolve: {
      simulado: SimuladoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/simulado-update.component').then(m => m.SimuladoUpdateComponent),
    resolve: {
      simulado: SimuladoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/simulado-update.component').then(m => m.SimuladoUpdateComponent),
    resolve: {
      simulado: SimuladoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default simuladoRoute;
