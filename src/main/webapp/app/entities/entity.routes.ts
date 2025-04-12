import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'cadastrodemetasApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'aluno',
    data: { pageTitle: 'cadastrodemetasApp.aluno.home.title' },
    loadChildren: () => import('./aluno/aluno.routes'),
  },
  {
    path: 'simulado',
    data: { pageTitle: 'cadastrodemetasApp.simulado.home.title' },
    loadChildren: () => import('./simulado/simulado.routes'),
  },
  {
    path: 'meta',
    data: { pageTitle: 'cadastrodemetasApp.meta.home.title' },
    loadChildren: () => import('./meta/meta.routes'),
  },
  {
    path: 'nota',
    data: { pageTitle: 'cadastrodemetasApp.nota.home.title' },
    loadChildren: () => import('./nota/nota.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
