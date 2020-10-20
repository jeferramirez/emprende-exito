import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionUsuariosComponent } from './modules/gestion-usuarios/gestion-usuarios.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent  },
  { path: 'home', component: HomeComponent, children: [
    { path: 'gestion-usuarios', component: GestionUsuariosComponent  },

  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
