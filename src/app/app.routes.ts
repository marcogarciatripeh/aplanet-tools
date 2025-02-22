import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./modules/home/pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'schema-table',
    loadComponent: () => import('./modules/schema-table/pages/schema-table/schema-table.component')
      .then(m => m.SchemaTableComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
