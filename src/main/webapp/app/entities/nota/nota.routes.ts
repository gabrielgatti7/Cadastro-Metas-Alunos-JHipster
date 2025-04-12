import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import NotaResolve from './route/nota-routing-resolve.service';

const notaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/nota.component').then(m => m.NotaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/nota-detail.component').then(m => m.NotaDetailComponent),
    resolve: {
      nota: NotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/nota-update.component').then(m => m.NotaUpdateComponent),
    resolve: {
      nota: NotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/nota-update.component').then(m => m.NotaUpdateComponent),
    resolve: {
      nota: NotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default notaRoute;
