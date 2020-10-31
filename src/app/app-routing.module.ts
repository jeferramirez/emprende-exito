import { NotAuthGuard } from './services/guards/not-auth.guard';
import { AuthGuard } from './services/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// programas
import { CreacionModuloComponent } from './modules/programas/creacion-modulo/creacion-modulo.component';
import { CreacionProgramaComponent } from './modules/programas/creacion-programa/creacion-programa.component';
import { GestionProgramasComponent } from './modules/programas/gestion-programas/gestion-programas.component';
// users
import { CreacionUsuarioComponent } from './modules/usuarios/creacion-usuario/creacion-usuario.component';
import { GestionPerfilComponent } from './modules/usuarios/gestion-perfil/gestion-perfil.component';
import { GestionUsuariosComponent } from './modules/usuarios/gestion-usuarios/gestion-usuarios.component';
import { CreacionLeccionComponent } from './modules/programas/creacion-leccion/creacion-leccion.component';
// pages
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'home', component: HomeComponent, children: [
    { path: 'gestion-usuarios', component: GestionUsuariosComponent  },
    { path: 'gestion-perfil', component: GestionPerfilComponent  },
    { path: 'creacion-usuario', component: CreacionUsuarioComponent  },
    { path: 'gestion-programas', component: GestionProgramasComponent  },
    { path: 'creacion-programa', component: CreacionProgramaComponent  },
    { path: 'creacion-modulo', component: CreacionModuloComponent  },
    { path: 'creacion-leccion', component: CreacionLeccionComponent  },
  ], canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

