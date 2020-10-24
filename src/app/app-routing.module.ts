import { AuthGuard } from './services/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreacionUsuarioComponent } from './modules/creacion-usuario/creacion-usuario.component';
import { GestionPerfilComponent } from './modules/gestion-perfil/gestion-perfil.component';
import { GestionUsuariosComponent } from './modules/gestion-usuarios/gestion-usuarios.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent  },
  { path: 'home', component: HomeComponent, children: [
    { path: 'gestion-usuarios', component: GestionUsuariosComponent  },
    { path: 'gestion-perfil', component: GestionPerfilComponent  },
    { path: 'creacion-usuario', component: CreacionUsuarioComponent  },
  ], canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
