import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { SidebarComponent } from './views/home/components/sidebar/sidebar.component';
import { NavbarComponent } from './views/home/components/navbar/navbar.component';
import { GestionUsuariosComponent } from './modules/usuarios/gestion-usuarios/gestion-usuarios.component';
import { GestionPerfilComponent } from './modules/usuarios/gestion-perfil/gestion-perfil.component';
import { RouterModule } from '@angular/router';
import { CreacionUsuarioComponent } from './modules/usuarios/creacion-usuario/creacion-usuario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { GestionProgramasComponent } from './modules/programas/gestion-programas/gestion-programas.component';
import { CreacionProgramaComponent } from './modules/programas/creacion-programa/creacion-programa.component';
import { CreacionModuloComponent } from './modules/programas/creacion-modulo/creacion-modulo.component';
import { CreacionLeccionComponent } from './modules/programas/creacion-leccion/creacion-leccion.component';
import { UpdateUsuarioComponent } from './modules/usuarios/update-usuario/update-usuario.component';
import { DemoMaterialModule } from './material-module';
import { GestionMatriculasComponent } from './modules/programas/gestion-matriculas/gestion-matriculas.component';
import { CreacionActividadComponent } from './modules/programas/creacion-actividad/creacion-actividad.component';
import { UpdateProgramaComponent } from './modules/programas/update-programa/update-programa.component';
import { UpdateModuloComponent } from './modules/programas/update-modulo/update-modulo.component';
import { UpdateLeccionComponent } from './modules/programas/update-leccion/update-leccion.component';
import { UpdateActividadComponent } from './modules/programas/update-actividad/update-actividad.component';
import { ModalComponent } from './modules/programas/modal/modal.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ModalReportComponent } from './modules/reportes/modal-report/modal-report.component';
import { ListaReportesComponent } from './modules/reportes/lista-reportes/lista-reportes.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    NavbarComponent,
    GestionUsuariosComponent,
    GestionPerfilComponent,
    CreacionUsuarioComponent,
    GestionProgramasComponent,
    CreacionProgramaComponent,
    CreacionModuloComponent,
    CreacionLeccionComponent,
    UpdateUsuarioComponent,
    GestionMatriculasComponent,
    CreacionActividadComponent,
    UpdateProgramaComponent,
    UpdateModuloComponent,
    UpdateLeccionComponent,
    UpdateActividadComponent,
    ModalComponent,
    ModalReportComponent,
    ListaReportesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  schemas: [NO_ERRORS_SCHEMA],

  bootstrap: [AppComponent]
})
export class AppModule { }
