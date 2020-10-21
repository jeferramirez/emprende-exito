import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { SidebarComponent } from './views/home/components/sidebar/sidebar.component';
import { NavbarComponent } from './views/home/components/navbar/navbar.component';
import { GestionUsuariosComponent } from './modules/gestion-usuarios/gestion-usuarios.component';
import { GestionPerfilComponent } from './modules/gestion-perfil/gestion-perfil.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    NavbarComponent,
    GestionUsuariosComponent,
    GestionPerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
