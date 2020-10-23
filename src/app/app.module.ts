import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { SidebarComponent } from './views/home/components/sidebar/sidebar.component';
import { NavbarComponent } from './views/home/components/navbar/navbar.component';
import { GestionUsuariosComponent } from './modules/gestion-usuarios/gestion-usuarios.component';
import { GestionPerfilComponent } from './modules/gestion-perfil/gestion-perfil.component';
import { RouterModule } from '@angular/router';
import { CreacionUsuarioComponent } from './modules/creacion-usuario/creacion-usuario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    NavbarComponent,
    GestionUsuariosComponent,
    GestionPerfilComponent,
    CreacionUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    HttpClientModule,
    MatInputModule
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],

  bootstrap: [AppComponent]
})
export class AppModule { }
